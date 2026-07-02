type PlaceholderProps = {
  title: string
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div style={{ padding: '24px' }}>
      <h2>{title}</h2>
      <p>Contenido básico pendiente de implementación.</p>
    </div>
  )
}
