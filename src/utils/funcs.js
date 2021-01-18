export const clearCells = () => {
  document.querySelectorAll('.cell').forEach(el => {
      el.classList.remove('VISITED')
      el.classList.remove('EXPLORED')
      el.classList.remove('WALL')
      el.classList.remove('START')
      el.classList.remove('END')
      el.classList.remove('PATH')
  })
}

export const resetPath = () => {
  document.querySelectorAll('.cell').forEach(el => {
      el.classList.remove('VISITED')
      el.classList.remove('EXPLORED')
      el.classList.remove('PATH')
  })
}