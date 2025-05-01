import React, { useState, FormEvent } from 'react';
import '../styles/ContactForm.css';
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || 'd2541a11-2487-4a3e-b334-e9e32a002b90';
// passy do maial
// mail: brain.boost.pwsi@gmail.com
// password: Pwsi12398
const ContactForm: React.FC = () => {
        const [statusMsg, setStatusMsg] = useState<string>('');
        const [submitting, setSubmitting] = useState<boolean>(false);

        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setSubmitting(true);
            setStatusMsg('Please wait…');

            const form = e.currentTarget;
            const formData = new FormData(form);
            formData.set('access_key', ACCESS_KEY);
            const payload = JSON.stringify(Object.fromEntries(formData.entries()));

            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: payload
                });
                const json = await res.json();
                if (res.ok) {
                    setStatusMsg('Form submitted successfully');
                } else {
                    setStatusMsg(json.message || 'Submission error');
                }
            } catch (err) {
                console.error(err);
                setStatusMsg('Something went wrong!');
            }

            form.reset();
            setTimeout(() => {
                setStatusMsg('');
            }, 3000);
            setSubmitting(false);
        };

        return (
            <section className="contact-section">
                <div className="contact-form-container">
                    <h1>Contact Form</h1>
                    {statusMsg && <div className="form-status">{statusMsg}</div>}
                    <form id="form" onSubmit={handleSubmit} className="contact-form">
                        {/* ukryte pole anti-bot */}
                        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
                        <div className="form-group">
                            <label>Name</label>
                            <input name="name" type="text" placeholder="Name" required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="email" placeholder="e-mail address" required />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea name="message" placeholder="Message" required />
                        </div>
                        <button className="btn btn-moving-gradient_2 btn-moving-gradient--blue" type="submit" disabled={submitting}>
                            {submitting ? 'Sending…' : 'Send'}
                        </button>
                    </form>
                </div>
            </section>
        );
    };

    export default ContactForm;