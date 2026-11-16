import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { content } from '@/content'
import { DetailRow } from '../atoms/DetailRow'

const { address, hours, phone, email } = content.contact

export function ContactDetails() {
  return (
    <dl className="space-y-6">
      <DetailRow icon={MapPin} label="Address">
        {address}
      </DetailRow>
      <DetailRow icon={Clock} label="Office hours">
        {hours}
      </DetailRow>
      <DetailRow icon={Phone} label="Phone">
        {phone}
      </DetailRow>
      <DetailRow icon={Mail} label="Email">
        <a href={`mailto:${email}`} className="underline underline-offset-4">
          {email}
        </a>
      </DetailRow>
    </dl>
  )
}
