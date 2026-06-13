import { mount } from '@vue/test-utils'
import ContextDetailDialog from '@/components/ContextDetailDialog.vue'

const item = {
  title: 'LA CRISÁLIDA',
  headerColor: '#342a83',
  body: 'En esta etapa, <strong>niñas, niños y adolescentes</strong> son manipulados.'
}

describe('ContextDetailDialog.vue', () => {
  const factory = (props = {}) => mount(ContextDetailDialog, {
    propsData: { dialog: true, item, ...props }
  })

  it('oculta el overlay (v-show) cuando dialog es false', () => {
    const wrapper = factory({ dialog: false })
    const overlay = wrapper.find('.ctx-overlay')
    expect(overlay.element.style.display).toBe('none')
  })

  it('muestra el overlay cuando dialog es true', () => {
    const wrapper = factory({ dialog: true })
    const overlay = wrapper.find('.ctx-overlay')
    expect(overlay.element.style.display).not.toBe('none')
  })

  it('renderiza el título y el cuerpo del item', () => {
    const wrapper = factory()
    expect(wrapper.find('.ctx-dialog-title').text()).toBe('LA CRISÁLIDA')
    expect(wrapper.find('.ctx-dialog-text').html()).toContain('<strong>niñas, niños y adolescentes</strong>')
  })

  it('aplica el headerColor del item a la cabecera', () => {
    const wrapper = factory()
    expect(wrapper.find('.ctx-dialog-header').attributes('style')).toContain('background-color: rgb(52, 42, 131)')
  })

  it('emite update:dialog=false al pulsar el botón de cerrar', async () => {
    const wrapper = factory()
    await wrapper.find('.ctx-dialog-close').trigger('click')
    expect(wrapper.emitted('update:dialog')).toBeTruthy()
    expect(wrapper.emitted('update:dialog')[0]).toEqual([false])
  })

  it('emite update:dialog=false al hacer clic en el fondo (backdrop)', async () => {
    const wrapper = factory()
    await wrapper.find('.ctx-overlay').trigger('click')
    expect(wrapper.emitted('update:dialog')).toBeTruthy()
    expect(wrapper.emitted('update:dialog')[0]).toEqual([false])
  })

  it('cierra al pulsar la tecla Escape', async () => {
    const wrapper = factory()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:dialog')).toBeTruthy()
    expect(wrapper.emitted('update:dialog')[0]).toEqual([false])
    wrapper.destroy()
  })

  it('no falla cuando item es null', () => {
    const wrapper = mount(ContextDetailDialog, { propsData: { dialog: false, item: null } })
    expect(wrapper.find('.ctx-dialog-title').text()).toBe('')
  })

  it('bloquea y restaura el scroll del body al abrir/cerrar', async () => {
    const wrapper = mount(ContextDetailDialog, { propsData: { dialog: false, item } })
    await wrapper.setProps({ dialog: true })
    expect(document.body.style.overflow).toBe('hidden')
    await wrapper.setProps({ dialog: false })
    expect(document.body.style.overflow).toBe('')
  })
})
