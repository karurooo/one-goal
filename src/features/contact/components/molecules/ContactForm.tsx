import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { contactSchema, type ContactValues } from '../../constants/contactSchema'

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { name: '', email: '', message: '' },
  })

  // Practice site: nothing is sent or stored (NFR-SEC-03, AC-CONTACT-03).
  const onSubmit = () => {
    reset()
    toast.success('Salamat! This is a practice site, so nothing was sent.')
  }

  const describedBy = (field: keyof ContactValues) => (errors[field] ? `${field}-error` : undefined)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field id="name" label="Name" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={describedBy('name')}
          {...register('name')}
        />
      </Field>
      <Field id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={describedBy('email')}
          {...register('email')}
        />
      </Field>
      <Field id="message" label="Message" error={errors.message?.message}>
        <Textarea
          id="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy('message')}
          {...register('message')}
        />
      </Field>
      <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 px-6 font-bold">
        Send message
      </Button>
    </form>
  )
}
