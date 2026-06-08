import { mount } from '@vue/test-utils'
import ContextCard from '@/components/ContextCard.vue'

describe('ContextCard.vue', () => {
  const factory = (props = {}) => mount(ContextCard, {
    propsData: {
      title: 'LA MARIPOSA',
      body: '<strong>Símbolo</strong> de esperanza.',
      headerColor: '#342a83',
      ...props
    }
  })

  it('muestra el título recibido por props', () => {
    const wrapper = factory()
    expect(wrapper.find('.ctx-card-title').text()).toBe('LA MARIPOSA')
  })

  it('renderiza el cuerpo como HTML (v-html)', () => {
    const wrapper = factory()
    const text = wrapper.find('.ctx-card-text')
    expect(text.html()).toContain('<strong>Símbolo</strong>')
    expect(text.text()).toContain('de esperanza.')
  })

  it('aplica el headerColor a la cabecera', () => {
    const wrapper = factory({ headerColor: '#6a3d8f' })
    expect(wrapper.find('.ctx-card-header').attributes('style')).toContain('background-color: rgb(106, 61, 143)')
  })

  it('emite "expand" con el título al pulsar el botón de expandir', async () => {
    const wrapper = factory()
    await wrapper.find('.ctx-card-expand').trigger('click')
    expect(wrapper.emitted('expand')).toBeTruthy()
    expect(wrapper.emitted('expand')[0]).toEqual(['LA MARIPOSA'])
  })

  it('marca el botón de expandir con una etiqueta accesible', () => {
    const wrapper = factory({ title: 'TRATA' })
    expect(wrapper.find('.ctx-card-expand').attributes('aria-label')).toBe('Expandir TRATA')
  })
})
