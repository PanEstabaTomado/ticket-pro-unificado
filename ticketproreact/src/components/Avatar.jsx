function Avatar({ nombre, foto, tamano = 'md' }) {
  const inicial = (nombre || '?').trim().charAt(0).toUpperCase()
  return (
    <span className={`avatar avatar-${tamano}`} aria-hidden="true">
      {foto ? <img src={foto} alt="" /> : inicial}
    </span>
  )
}

export default Avatar
