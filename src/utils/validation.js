import { TODAY_ISO } from "../constants";

/**
 * Validate the transaction form fields.
 *
 * @param {{ desc: string, amount: string, date: string }} fields
 * @returns {Record<string, string>} — plain object of field → error message.
 *   An empty object means the form is valid.
 */
export function validateForm({ desc, amount, date }) {
  const errors = {};

  if (!desc.trim()) {
    errors.desc = "Description is required.";
  }

  const num = Number(amount);
  if (!amount || isNaN(num) || num <= 0) {
    errors.amount = "Enter a positive amount greater than zero.";
  }

  if (!date) {
    errors.date = "Date is required.";
  } else if (date > TODAY_ISO) {
    errors.date = "Date cannot be in the future.";
  }

  return errors;
}

/**
 * Validate support request form fields.
 *
 * @param {{ name: string, email: string, subject: string, details: string }} fields
 * @returns {Record<string, string>}
 */
export function validateSupportForm({ name, email, subject, details }) {
  const errors = {};
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name.trim()) {
    errors.name = "Name is required.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailOk.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!subject.trim()) {
    errors.subject = "A title is required.";
  } else if (subject.trim().length < 4) {
    errors.subject = "Use at least 4 characters.";
  }

  if (!details.trim()) {
    errors.details = "Please share a few more details.";
  } else if (details.trim().length < 10) {
    errors.details = "Use at least 10 characters.";
  }

  return errors;
}
