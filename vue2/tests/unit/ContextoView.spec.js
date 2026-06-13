import { shallowMount } from '@vue/test-utils'
import ContextoView from '@/views/ContextoView.vue'

// shallowMount sustituye los componentes hijos (HeaderComp, ContextCard,
// ContextDetailDialog) por stubs, evitando dependencias de Vuetify/router.
const factory = () => shallowMount(ContextoView, {
  stubs: {
    'router-link': true,
    RouterLink: true
  }
})

describe('ContextoView.vue', () => {
  it('renderiza las seis tarjetas flotantes (ContextCard)', () => {
    const wrapper = factory()
    expect(wrapper.findAllComponents({ name: 'ContextCard' }).length).toBe(6)
  })

  it('todas las tarjetas usan la cabecera índigo #342a83 del mockup', () => {
    const wrapper = factory()
    const cards = wrapper.findAllComponents({ name: 'ContextCard' })
    cards.wrappers.forEach(card => {
      expect(card.props('headerColor')).toBe('#342a83')
    })
  })

  it('expone un mapa de detalles con las 10 entradas (6 tarjetas + 4 secciones)', () => {
    const wrapper = factory()
    expect(Object.keys(wrapper.vm.conceptDetails)).toHaveLength(10)
  })

  it('todos los detalles del diálogo usan la cabecera índigo #342a83', () => {
    const wrapper = factory()
    Object.values(wrapper.vm.conceptDetails).forEach(detail => {
      expect(detail.headerColor).toBe('#342a83')
    })
  })

  it('onExpand abre el diálogo con el contenido del concepto', () => {
    const wrapper = factory()
    expect(wrapper.vm.detailOpen).toBe(false)
    wrapper.vm.onExpand('EL CONSUMIDOR')
    expect(wrapper.vm.detailOpen).toBe(true)
    expect(wrapper.vm.detailItem.title).toBe('EL CONSUMIDOR')
    expect(wrapper.vm.detailItem.headerColor).toBe('#342a83')
    expect(wrapper.vm.detailItem.body).toContain('eslabón final')
  })

  it('onExpand mapea correctamente los botones LEER MÁS de las secciones', () => {
    const wrapper = factory()
    wrapper.vm.onExpand('Campaña Niñez Primero')
    expect(wrapper.vm.detailOpen).toBe(true)
    expect(wrapper.vm.detailItem.title).toBe('CAMPAÑA “NIÑEZ PRIMERO”')
    expect(wrapper.vm.detailItem.headerColor).toBe('#342a83')
  })

  it('onExpand ignora títulos desconocidos sin abrir el diálogo', () => {
    const wrapper = factory()
    wrapper.vm.onExpand('TÍTULO INEXISTENTE')
    expect(wrapper.vm.detailOpen).toBe(false)
    expect(wrapper.vm.detailItem).toBeNull()
  })

  it('renderiza las cuatro secciones con su texto y botón LEER MÁS', () => {
    const wrapper = factory()
    expect(wrapper.findAll('.ctx-section').length).toBe(4)
    expect(wrapper.findAll('.ctx-text').length).toBe(4)
    expect(wrapper.findAll('.leer-mas').length).toBe(4)
  })

  it('incluye las capas decorativas de la escena café (crisálida y monumento)', () => {
    const wrapper = factory()
    expect(wrapper.find('.cafe-crisalida').exists()).toBe(true)
    expect(wrapper.find('.cafe-monumento').exists()).toBe(true)
    expect(wrapper.find('.cafe-manos').exists()).toBe(true)
  })

  it('renderiza el pie de página con el aviso de privacidad', () => {
    const wrapper = factory()
    const footer = wrapper.find('.footer-bar')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toContain('CIUDAD DE MÉXICO')
  })

  it('reacciona al evento "expand" emitido por una tarjeta hija', () => {
    const wrapper = factory()
    const card = wrapper.findAllComponents({ name: 'ContextCard' }).at(0)
    card.vm.$emit('expand', 'TRATA')
    expect(wrapper.vm.detailOpen).toBe(true)
    expect(wrapper.vm.detailItem.title).toBe('TRATA')
  })
})
