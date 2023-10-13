type Props = {
  title: string
  description?: string
}

export function Heading({ title, description }: Props) {
  return (
    <div className="flex flex-col space-y-4 pt-4">
      <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
      <div className="flex space-x-2">
        <p className="font-semibold">{description}</p>
      </div>
    </div>
  )
}
