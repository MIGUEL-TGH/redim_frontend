import { shallowMount } from '@vue/test-utils'
import MainView from '@/views/MainView.vue'

// shallowMount sustituye el componente hijo (HeaderComp) por un stub,
// evitando dependencias de Vuetify/router.
const factory = () => {
  const wrapper = shallowMount(MainView, {
    stubs: {
      'router-link': true,
      RouterLink: true
    }
  })
  // jsdom no calcula layout: se simula el lienzo del hero a 1920px
  wrapper.vm.$refs.canvas.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 1920,
    height: 1029
  })
  return wrapper
}

// Helper: evento de puntero mínimo para los métodos de arrastre
const pointerEvent = (x, y) => ({ clientX: x, clientY: y, preventDefault: () => {} })

describe('MainView.vue', () => {
  beforeEach(() => {
    // Ancho de escritorio por defecto (zoom 1 en el juego)
    window.innerWidth = 1280
  })

  // ===== Estructura general (fidelidad al mockup 3.1) =====

  it('renderiza las tres secciones y el pie de página', () => {
    const wrapper = factory()
    expect(wrapper.find('.hero-section').exists()).toBe(true)
    expect(wrapper.find('.banner-section').exists()).toBe(true)
    expect(wrapper.find('.equipo-section').exists()).toBe(true)
    expect(wrapper.find('.footer-bar').exists()).toBe(true)
  })

  it('renderiza la silueta armable y las 15 piezas (12 letras + 3 mariposas)', () => {
    const wrapper = factory()
    expect(wrapper.find('.hero-armable').exists()).toBe(true)
    expect(wrapper.findAll('.hero-piece').length).toBe(15)
    const letras = wrapper.vm.pieces.filter(p => p.alt.toLowerCase().includes('letra'))
    const mariposas = wrapper.vm.pieces.filter(p => p.alt.startsWith('Mariposa'))
    expect(letras.length).toBe(12)
    expect(mariposas.length).toBe(3)
  })

  it('las piezas inician dispersas en su posición del mockup, sin pegar', () => {
    const wrapper = factory()
    wrapper.vm.pieces.forEach(piece => {
      expect(piece.placed).toBe(false)
      expect(piece.x).toBe(piece.sx)
      expect(piece.y).toBe(piece.sy)
    })
  })

  it('el banner muestra MAPA INTERACTIVO y el botón EXPLORAR hacia /mapa', () => {
    const wrapper = factory()
    expect(wrapper.find('.banner-title').text().replace(/\s+/g, ' ')).toBe('MAPA INTERACTIVO')
    const explorar = wrapper.find('.banner-explorar')
    expect(explorar.exists()).toBe(true)
    expect(explorar.text()).toBe('EXPLORAR')
    expect(explorar.attributes('to')).toBe('/mapa')
  })

  it('la sección EQUIPO incluye las tres tarjetas con los logos aliados', () => {
    const wrapper = factory()
    expect(wrapper.findAll('.equipo-card').length).toBe(3)
    expect(wrapper.find('.equipo-logo--ue').attributes('alt')).toContain('Unión Europea')
    expect(wrapper.find('.equipo-logo--redim').attributes('alt')).toContain('REDIM')
    expect(wrapper.find('.equipo-logo--cam').attributes('alt')).toContain('CAM')
  })

  it('la sección EQUIPO muestra la cita "Juntos y Juntas..."', () => {
    const wrapper = factory()
    const quote = wrapper.find('.equipo-quote')
    expect(quote.exists()).toBe(true)
    expect(quote.text()).toContain('Juntos y Juntas, con amor, dignidad y compromiso')
    expect(quote.text()).toContain('despojadas de su futuro')
  })

  it('renderiza el pie de página con el aviso de privacidad', () => {
    const wrapper = factory()
    const footer = wrapper.find('.footer-bar')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toContain('CIUDAD DE MÉXICO')
    expect(footer.find('.footer-link').attributes('to')).toBe('/transparencia')
  })

  // ===== Juego de arrastrar y pegar letras =====

  it('arrastrar una pieza actualiza su posición siguiendo el puntero', () => {
    const wrapper = factory()
    const piece = wrapper.vm.pieces.find(p => p.id === 'n')
    wrapper.vm.startDrag(piece, pointerEvent(piece.x, piece.y))
    wrapper.vm.onDrag(piece, pointerEvent(900, 500))
    expect(piece.x).toBe(900)
    expect(piece.y).toBe(500)
  })

  it('soltar una pieza cerca de su silueta la pega exactamente en el objetivo', () => {
    const wrapper = factory()
    const piece = wrapper.vm.pieces.find(p => p.id === 'n')
    wrapper.vm.startDrag(piece, pointerEvent(piece.x, piece.y))
    // Se suelta a menos de 80px de diseño del centro objetivo (710, 397)
    wrapper.vm.onDrag(piece, pointerEvent(piece.tx + 50, piece.ty - 30))
    wrapper.vm.endDrag(piece, pointerEvent(piece.tx + 50, piece.ty - 30))
    expect(piece.placed).toBe(true)
    expect(piece.x).toBe(piece.tx)
    expect(piece.y).toBe(piece.ty)
  })

  it('soltar una pieza lejos de su silueta la deja donde cayó, sin pegar', () => {
    const wrapper = factory()
    const piece = wrapper.vm.pieces.find(p => p.id === 'z')
    wrapper.vm.startDrag(piece, pointerEvent(piece.x, piece.y))
    wrapper.vm.onDrag(piece, pointerEvent(400, 900))
    wrapper.vm.endDrag(piece, pointerEvent(400, 900))
    expect(piece.placed).toBe(false)
    expect(piece.x).toBe(400)
    expect(piece.y).toBe(900)
  })

  it('una pieza pegada ya no puede arrastrarse de nuevo', () => {
    const wrapper = factory()
    const piece = wrapper.vm.pieces.find(p => p.id === 'o')
    wrapper.vm.startDrag(piece, pointerEvent(piece.x, piece.y))
    wrapper.vm.onDrag(piece, pointerEvent(piece.tx, piece.ty))
    wrapper.vm.endDrag(piece, pointerEvent(piece.tx, piece.ty))
    expect(piece.placed).toBe(true)
    wrapper.vm.startDrag(piece, pointerEvent(piece.tx, piece.ty))
    expect(wrapper.vm.drag).toBeNull()
    wrapper.vm.onDrag(piece, pointerEvent(100, 100))
    expect(piece.x).toBe(piece.tx)
    expect(piece.y).toBe(piece.ty)
  })

  it('el arrastre queda confinado dentro del lienzo del hero', () => {
    const wrapper = factory()
    const piece = wrapper.vm.pieces.find(p => p.id === 'm')
    wrapper.vm.startDrag(piece, pointerEvent(piece.x, piece.y))
    wrapper.vm.onDrag(piece, pointerEvent(-500, -500))
    expect(piece.x).toBeGreaterThanOrEqual(piece.w / 2)
    expect(piece.y).toBeGreaterThanOrEqual(piece.h / 2)
    wrapper.vm.onDrag(piece, pointerEvent(5000, 5000))
    expect(piece.x).toBeLessThanOrEqual(1920 - piece.w / 2)
    expect(piece.y).toBeLessThanOrEqual(1029 - piece.h / 2)
  })

  it('solo la pieza activa responde al movimiento del puntero', () => {
    const wrapper = factory()
    const activa = wrapper.vm.pieces.find(p => p.id === 'n')
    const otra = wrapper.vm.pieces.find(p => p.id === 'z')
    wrapper.vm.startDrag(activa, pointerEvent(activa.x, activa.y))
    wrapper.vm.onDrag(otra, pointerEvent(700, 700))
    expect(otra.x).toBe(otra.sx)
    expect(otra.y).toBe(otra.sy)
  })

  it('allPlaced es verdadero solo cuando las 15 piezas están pegadas', async () => {
    const wrapper = factory()
    expect(wrapper.vm.allPlaced).toBe(false)
    wrapper.vm.pieces.forEach(piece => {
      piece.placed = true
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.allPlaced).toBe(true)
    expect(wrapper.find('.hero-canvas').classes()).toContain('is-complete')
  })

  // ===== Responsividad del juego =====

  it('usa zoom 1 en escritorio, 1.45 en móvil horizontal y 1.7 en móvil', () => {
    const wrapper = factory()
    window.innerWidth = 1280
    expect(wrapper.vm.layoutZoom()).toBe(1)
    window.innerWidth = 700
    expect(wrapper.vm.layoutZoom()).toBe(1.45)
    window.innerWidth = 375
    expect(wrapper.vm.layoutZoom()).toBe(1.7)
  })

  it('al cambiar a móvil las piezas se agrandan y siguen dentro del lienzo', () => {
    const wrapper = factory()
    window.innerWidth = 375
    wrapper.vm.onResize()
    expect(wrapper.vm.zoom).toBe(1.7)
    wrapper.vm.pieces.forEach(piece => {
      const halfW = (piece.w * 1.7) / 2
      const halfH = (piece.h * 1.7) / 2
      expect(piece.x - halfW).toBeGreaterThanOrEqual(0)
      expect(piece.x + halfW).toBeLessThanOrEqual(1920)
      expect(piece.y - halfH).toBeGreaterThanOrEqual(0)
      expect(piece.y + halfH).toBeLessThanOrEqual(1029)
    })
  })

  it('en móvil el objetivo sigue alineado a la silueta agrandada', () => {
    const wrapper = factory()
    window.innerWidth = 375
    wrapper.vm.onResize()
    const piece = wrapper.vm.pieces.find(p => p.id === 'n')
    const target = wrapper.vm.targetCenter(piece)
    // El objetivo escala con el mismo zoom desde el centro del lienzo
    expect(target.x).toBeCloseTo(960 + (piece.tx - 960) * 1.7, 5)
    expect(target.y).toBeCloseTo(514.5 + (piece.ty - 514.5) * 1.7, 5)
  })

  it('las piezas pegadas permanecen sobre su objetivo tras un resize', () => {
    const wrapper = factory()
    const piece = wrapper.vm.pieces.find(p => p.id === 'e1')
    wrapper.vm.startDrag(piece, pointerEvent(piece.x, piece.y))
    wrapper.vm.onDrag(piece, pointerEvent(piece.tx, piece.ty))
    wrapper.vm.endDrag(piece, pointerEvent(piece.tx, piece.ty))
    expect(piece.placed).toBe(true)
    window.innerWidth = 375
    wrapper.vm.onResize()
    const target = wrapper.vm.targetCenter(piece)
    expect(piece.x).toBeCloseTo(target.x, 5)
    expect(piece.y).toBeCloseTo(target.y, 5)
  })

  it('quita el listener de resize al destruirse', () => {
    const spy = jest.spyOn(window, 'removeEventListener')
    const wrapper = factory()
    wrapper.destroy()
    expect(spy).toHaveBeenCalledWith('resize', expect.any(Function))
    spy.mockRestore()
  })
})
