import { Card } from '@/components/ui/card'
import { renderServiceIcon } from '../../constants/serviceIcons'

type ServiceCardProps = { icon: string; title: string; text: string }

export function ServiceCard({ icon, title, text }: ServiceCardProps) {
  return (
    <Card className="gap-4 rounded-2xl p-6">
      <span className="flex size-12 items-center justify-center rounded-xl bg-court text-white">
        {renderServiceIcon(icon, 'size-6')}
      </span>
      <h3 className="text-lg">{title}</h3>
      <p className="leading-relaxed text-ink-2">{text}</p>
    </Card>
  )
}
