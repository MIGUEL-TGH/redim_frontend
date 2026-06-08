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

  it('expone un mapa de detalles con las 10 entradas (6 tarjetas + 4 secciones)', () => {
    const wrapper = factory()
    expect(Object.keys(wrapper.vm.conceptDetails)).toHaveLength(10)
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
    expect(wrapper.vm.detailItem.headerColor).toBe('#6a3d8f')
  })

  it('onExpand ignora títulos desconocidos sin abrir el diálogo', () => {
    const wrapper = factory()
    wrapper.vm.onExpand('TÍTULO INEXISTENTE')
    expect(wrapper.vm.detailOpen).toBe(false)
    expect(wrapper.vm.detailItem).toBeNull()
  })

  it('la sección intro (Contexto) alinea su texto a la derecha', () => {
    const wrapper = factory()
    const intro = wrapper.find('.ctx-section--intro')
    expect(intro.exists()).toBe(true)
    expect(intro.find('.ctx-text').classes()).toContain('ctx-text--right')
  })

  it('reacciona al evento "expand" emitido por una tarjeta hija', () => {
    const wrapper = factory()
    const card = wrapper.findAllComponents({ name: 'ContextCard' }).at(0)
    card.vm.$emit('expand', 'TRATA')
    expect(wrapper.vm.detailOpen).toBe(true)
    expect(wrapper.vm.detailItem.title).toBe('TRATA')
  })
})
