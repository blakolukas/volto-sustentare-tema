/**
 * Custom ContactForm component for Volto.
 * @module customizations/components/theme/ContactForm/ContactForm
 */

import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import { Container, Form, Button, Message } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { defineMessages, injectIntl, FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Helmet } from '@plone/volto/helpers';
import { emailNotification } from '@plone/volto/actions/emailNotification/emailNotification';
import config from '@plone/volto/registry';
import './ContactForm.css';

const messages = defineMessages({
  contact: {
    id: 'Contact',
    defaultMessage: 'Contato',
  },
  name: {
    id: 'Name',
    defaultMessage: 'Nome',
  },
  email: {
    id: 'Email',
    defaultMessage: 'E-mail',
  },
  phone: {
    id: 'Phone',
    defaultMessage: 'Telefone',
  },
  subject: {
    id: 'Subject',
    defaultMessage: 'Assunto',
  },
  message: {
    id: 'Message',
    defaultMessage: 'Mensagem',
  },
  send: {
    id: 'Send',
    defaultMessage: 'Enviar',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancelar',
  },
  required: {
    id: 'Required field',
    defaultMessage: 'Campo obrigatório',
  },
  invalidEmail: {
    id: 'Invalid email',
    defaultMessage: 'E-mail inválido',
  },
  successMessage: {
    id: 'Message sent successfully',
    defaultMessage: 'Mensagem enviada com sucesso!',
  },
  errorMessage: {
    id: 'Error sending message',
    defaultMessage: 'Erro ao enviar mensagem. Por favor, tente novamente.',
  },
  namePlaceholder: {
    id: 'Enter your name',
    defaultMessage: 'Digite seu nome completo',
  },
  emailPlaceholder: {
    id: 'Enter your email',
    defaultMessage: 'Digite seu e-mail',
  },
  phonePlaceholder: {
    id: 'Enter your phone',
    defaultMessage: 'Digite seu telefone (opcional)',
  },
  subjectPlaceholder: {
    id: 'Enter subject',
    defaultMessage: 'Digite o assunto',
  },
  messagePlaceholder: {
    id: 'Enter your message',
    defaultMessage: 'Digite sua mensagem',
  },
});

const useEmailNotification = () => {
  const loading = useSelector((state) => state.emailNotification.loading);
  const loaded = useSelector((state) => state.emailNotification.loaded);
  const error = useSelector((state) => state.emailNotification.error);

  return { loading, loaded, error };
};

function ContactForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { loaded, loading, error } = useEmailNotification();
  const intl = useIntl();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Validação de e-mail
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = intl.formatMessage(messages.required);
    }

    if (!formData.email.trim()) {
      newErrors.email = intl.formatMessage(messages.required);
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = intl.formatMessage(messages.invalidEmail);
    }

    if (!formData.subject.trim()) {
      newErrors.subject = intl.formatMessage(messages.required);
    }

    if (!formData.message.trim()) {
      newErrors.message = intl.formatMessage(messages.required);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  // Handler para mudanças nos campos
  const handleChange = (_, { name, value }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);


    dispatch(emailNotification(formData.email, formData.message, formData.name, formData.subject));

  };

  
  return (
    <Container id="contact-form">
      <Helmet title={intl.formatMessage(messages.contact)} />
      <div className="container">
        <article id="content">
          <header>
            <p className='contact-form-info'>
                Utilize o formulário abaixo, ou nosso e-mail (sustentare@procergs.rs.gov.br), para enviar suas dúvidas, críticas, sugestões ou elogios.
                <br/>Se preferir, contate-nos pelos telefones: 
                <strong><br/><br/>(51) 3210-3837, (51) 3210-3487, (51) 3210-3889.</strong>
                <br/><br/>Sua colaboração é importante para que possamos fazer mais e melhor.
                <br/>Caso seja necessário entraremos em contato o mais breve possível.
            </p>
            <h1 className="documentFirstHeading">
              <FormattedMessage
                id="Contact Form"
                defaultMessage="Formulário de Contato"
              />
            </h1>
          </header>

          <section id="content-core">
            {submitStatus === 'error' && (
              <Message negative>
                <Message.Header>
                  <FormattedMessage
                    id="Error"
                    defaultMessage="Erro"
                  />
                </Message.Header>
                <p>{intl.formatMessage(messages.errorMessage)}</p>
              </Message>
            )}

            {submitStatus === 'success' && (
              <Message positive>
                <Message.Header>
                  <FormattedMessage
                    id="Success"
                    defaultMessage="Sucesso"
                  />
                </Message.Header>
                <p>{intl.formatMessage(messages.successMessage)}</p>
              </Message>
            )}

            <Form onSubmit={handleSubmit} className="contact-form-wrapper">
              <Form.Field required error={!!errors.name}>
                <label>{intl.formatMessage(messages.name)}</label>
                <Form.Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={intl.formatMessage(messages.namePlaceholder)}
                  error={errors.name ? { content: errors.name } : null}
                />
              </Form.Field>

              <Form.Group widths="equal">
                <Form.Field required error={!!errors.email}>
                  <label>{intl.formatMessage(messages.email)}</label>
                  <Form.Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={intl.formatMessage(messages.emailPlaceholder)}
                    error={errors.email ? { content: errors.email } : null}
                  />
                </Form.Field>

                <Form.Field>
                  <label>{intl.formatMessage(messages.phone)}</label>
                  <Form.Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={intl.formatMessage(messages.phonePlaceholder)}
                  />
                </Form.Field>
              </Form.Group>

              <Form.Field required error={!!errors.subject}>
                <label>{intl.formatMessage(messages.subject)}</label>
                <Form.Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={intl.formatMessage(messages.subjectPlaceholder)}
                  error={errors.subject ? { content: errors.subject } : null}
                />
              </Form.Field>

              <Form.Field required error={!!errors.message}>
                <label>{intl.formatMessage(messages.message)}</label>
                <Form.TextArea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={intl.formatMessage(messages.messagePlaceholder)}
                  rows={6}
                  error={errors.message ? { content: errors.message } : null}
                />
              </Form.Field>

              <div className="form-actions">
                <Button
                  secondary
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  {intl.formatMessage(messages.cancel)}
                </Button>
                <Button
                  primary
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {intl.formatMessage(messages.send)}
                </Button>
              </div>
            </Form>
          </section>
        </article>
      </div>
    </Container>
  );
}

ContactForm.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  pathname: PropTypes.string,
};

ContactForm.defaultProps = {
  pathname: '/contact',
};

export default compose(
  injectIntl,
  connect(
    (_, props) => ({
      pathname: props.location?.pathname || '/contact',
    }),
  ),
)(ContactForm);