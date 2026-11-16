import { Card } from '@/components/ui/card'
import { CheckItem } from '../atoms/CheckItem'

export function MandateCard({ items }: { items: string[] }) {
  return (
    <Card className="rounded-2xl p-6 md:p-8">
      <h3 className="text-xl">Our mandate</h3>
      <ul className="mt-5 space-y-4 text-base leading-relaxed text-ink-2">
        {items.map((item) => (
          <CheckItem key={item}>{item}</CheckItem>
        ))}
      </ul>
    </Card>
  )
}
