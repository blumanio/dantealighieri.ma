'use client'
import CalendlyEmbed from '../../../components/CalendlyEmbed'

export default function Services() {
  return (
    <div className='container'>
      <h1>Schedule an Appointment</h1>
      <CalendlyEmbed url='https://calendly.com/dantema/dante-alighieri-consulting' />
    </div>
  )
}
