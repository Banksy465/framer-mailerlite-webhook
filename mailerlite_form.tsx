import * as React from "react"
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react"
import { ControlType, addPropertyControls } from "framer"

// OneSpring Brand Colors & Typography
const colors = {
    textPrimary: "rgba(3, 9, 38, 0.9)",
    textSecondary: "#323950",
    brandBlue: "rgb(20, 60, 255)",
    brandBlueHover: "#1C2036",
    inputBg: "#fafafa",
    inputBorder: "#f5f6fc",
    errorRed: "#ff0000",
    white: "#fff",
}

const typography = {
    fontFamily: "'Poppins', sans-serif",
    fontSizeBase: "16px",
    labelFontWeight: "700",
    inputFontWeight: "400",
    lineHeight: "1.5",
}

const styles = {
    container: {
        maxWidth: 480,
        margin: "0 auto",
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: "24px 32px 32px 32px",
        boxSizing: "border-box" as const,
        fontFamily: typography.fontFamily,
        color: colors.textPrimary,
    },
    heading: {
        fontWeight: 400,
        fontSize: 32,
        marginBottom: 8,
    },
    label: {
        display: "block",
        fontWeight: typography.labelFontWeight,
        fontSize: typography.fontSizeBase,
        marginBottom: 6,
        color: colors.textPrimary,
    },
    input: {
        width: "100%",
        height: 48,
        padding: "12px 16px",
        fontSize: typography.fontSizeBase,
        fontWeight: typography.inputFontWeight,
        lineHeight: typography.lineHeight,
        borderRadius: 8,
        border: `1px solid ${colors.inputBorder}`,
        backgroundColor: colors.inputBg,
        boxSizing: "border-box" as const,
        outline: "none",
        transition: "border-color 0.2s ease",
    },
    inputError: {
        borderColor: colors.errorRed,
    },
    errorText: {
        color: colors.errorRed,
        fontSize: 14,
        marginTop: 8,
        marginBottom: 16,
    },
    checkboxContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: 16,
    },
    checkbox: {
        marginRight: 12,
        width: 20,
        height: 20,
    },
    button: {
        width: "100%",
        height: 48,
        padding: "0 24px",
        fontSize: 14,
        fontWeight: "700",
        fontFamily: typography.fontFamily,
        textTransform: "uppercase",
        backgroundColor: colors.brandBlue,
        color: colors.white,
        border: "none",
        borderRadius: 32,
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    buttonHover: {
        backgroundColor: colors.brandBlueHover,
    },
    successMessage: {
        fontSize: 18,
        fontWeight: 400,
        color: colors.brandBlue,
        textAlign: "center" as const,
    },
    modeSwitch: {
        marginBottom: 24,
        display: "flex",
        justifyContent: "space-around",
        cursor: "pointer",
        userSelect: "none" as const,
    },
    modeButton: (active: boolean) => ({
        padding: "8px 16px",
        borderRadius: 32,
        backgroundColor: active ? colors.brandBlue : colors.inputBg,
        color: active ? colors.white : colors.textPrimary,
        fontWeight: active ? "700" : "400",
        border: "none",
    }),
}

const GROUP_ID = "157146606153500460"

// Group options for Framer property control and internal use
const group_options = [
    { id: "157146606153500460", name: "New Subscribers" },
    ...[
        { id: "157672824957306425", name: "Chief Product Officer" },
        { id: "157383625442068102", name: "Developers and Engineers" },
        { id: "157383608380687694", name: "Executives" },
        { id: "157383640385324712", name: "Preference Pending" },
        { id: "157383582186211126", name: "Product Managers" },
        { id: "157383592800946094", name: "UX Design Leaders" },
    ].sort((a, b) => a.name.localeCompare(b.name)),
]

// Field keys from MailerLite API for dropdown
const mailerlite_field_keys = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "last_name", label: "Last name" },
    { key: "company", label: "Company" },
    { key: "city", label: "City" },
    { key: "country", label: "Country" },
    { key: "phone", label: "Phone" },
    { key: "state", label: "State" },
    { key: "z_i_p", label: "Zip" },
    { key: "ai_stage", label: "AI Stage" },
    { key: "content_interests", label: "Content Interests" },
    { key: "industry", label: "Industry" },
    { key: "preference_status", label: "Preference Status" },
    { key: "role", label: "Role" },
]

export interface Field {
    name: string
    label: string
    type: "text" | "email" | "checkbox" | "radio" | "select" | "number" | "tel"
    required: boolean
    hint?: string
    options?: { label: string; value?: string }[]
    allowOther?: boolean
}

export interface Props {
    formId?: string
    title: string
    subtitle?: string
    fields: Field[]
    groupId?: string
    mode?: "subscribe" | "unsubscribe"
    containerFill?: string
    containerPadding?: string
    containerBorderColor?: string
    fieldPadding?: number
    showMarketingPermissions?: boolean
    marketingPermissionsTitle?: string
    marketingPermissionsText?: string
    submitButtonText?: string
    successHeading?: string
    successBody?: string
}

export default function MailerLiteForm({
    formId,
    title,
    subtitle,
    fields: fieldsProp,
    groupId = GROUP_ID,
    mode = "subscribe",
    containerFill = "#fff",
    containerPadding = "24px 24px 40px 24px",
    containerBorderColor = "rgba(6, 18, 77, 0.45)",
    fieldPadding = 24,
    showMarketingPermissions = true,
    marketingPermissionsTitle = "Marketing Permissions",
    marketingPermissionsText = "The information you provide on this form will only be used to provide you with updates and personalized marketing.",
    submitButtonText = "Submit",
    successHeading = "Success!",
    successBody = "Your form was submitted.",
}: Props) {
    const generateValue = (label = "") =>
        label
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^\w_]/g, "")

    const fields = React.useMemo(() => {
        return fieldsProp.map((field) => {
            if (
                (field.type === "radio" || field.type === "checkbox") &&
                field.options
            ) {
                return {
                    ...field,
                    options: field.options.map((opt) => ({
                        ...opt,
                        value: opt.value || generateValue(opt.label),
                    })),
                }
            }
            return field
        })
    }, [fieldsProp])

    const [formData, setFormData] = useState<
        Record<string, string | boolean | string[] | null>
    >(() => {
        const initial: Record<string, string | boolean | string[] | null> = {}
        fields.forEach((field) => {
            if (field.type === "checkbox" && field.options) {
                initial[field.name] = []
            } else if (field.type === "checkbox") {
                initial[field.name] = false
            } else if (field.type === "radio") {
                initial[field.name] = null
            } else {
                initial[field.name] = null
            }
        })
        return initial
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const errorSummaryRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (Object.keys(errors).length > 0 && errorSummaryRef.current) {
            errorSummaryRef.current.focus()
        }
    }, [errors])

    useEffect(() => {
        const style = document.createElement("style")
        style.innerHTML = `
            button[type="submit"]:focus,
            button[type="submit"]:active {
                border: 3px solid rgba(20, 60, 255, 0.6) !important;
            }
            input:not(.other-text-input):focus,
            input:not(.other-text-input):active {
                border: 3px solid rgb(20, 60, 255) !important;
            }
            button[type="submit"]:hover {
                background: rgba(3, 9, 38, 0.9) !important;
            }
            .other-text-input {
                margin-left: 8px;
                margin-right: 0;
                border: 0;
                border-bottom: 1px solid #ccc;
                font-family: 'Poppins', sans-serif;
                font-size: 16px;
                flex: 1;
                padding-left: 4px;
                padding-bottom: 0;
                padding-right: 24px;
                background: transparent;
                outline: none;
                line-height: 1.4;
                height: auto;
                border-radius: 0;
                transition: border-bottom-color 0.2s ease, border-bottom-width 0.2s ease;
                align-self: center;
                vertical-align: middle;
                display: inline-flex;
                align-items: center;
                width: 100%;
                max-width: calc(100% - 24px);
                box-sizing: border-box;
            }
            .other-text-input:hover:not(:disabled),
            .other-text-input:focus:not(:disabled) {
                border-bottom-color: rgb(20, 60, 255);
                border-bottom-width: 2px;
            }
            .other-text-input:disabled {
                border-bottom: 1px solid #ccc;
                background: transparent;
                color: #999;
                cursor: not-allowed;
            }

            /* Custom Radio and Checkbox Styles */
            input[type="radio"],
            input[type="checkbox"] {
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                position: relative;
                width: 20px;
                height: 20px;
                border: 1.5px solid rgba(6, 18, 77, 0.45);
                cursor: pointer;
                margin-left: 0;
                padding-left: 0;
                margin-right: 12px;
                flex-shrink: 0;
                transition: background-color 0.2s, border-color 0.2s;
            }
            
            input[type="radio"] {
                border-radius: 50%;
            }

            input[type="checkbox"] {
                border-radius: 4px;
            }

            input[type="radio"]:checked,
            input[type="checkbox"]:checked {
                background-color: rgb(20, 60, 255);
                border-color: rgb(20, 60, 255);
            }

            input[type="radio"]:checked::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: white;
            }

            input[type="checkbox"]:checked::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 14px;
                height: 14px;
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' fill='white'%3e%3cpath d='M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z'%3e%3c/svg%3e");
                background-size: contain;
                background-repeat: no-repeat;
            }
        `
        document.head.appendChild(style)
        return () => {
            document.head.removeChild(style)
        }
    }, [])

    function isValidEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    }

    function validate() {
        const newErrors: Record<string, string> = {}
        fields.forEach((field) => {
            const value = formData[field.name]
            if (field.required) {
                if (field.type === "checkbox" && !value) {
                    newErrors[field.name] = `${field.label.toLowerCase()} is required`
                } else if (
                    field.type !== "checkbox" &&
                    (!value ||
                        (typeof value === "string" && value.trim() === "") ||
                        (Array.isArray(value) && value.length === 0))
                ) {
                    newErrors[field.name] = `${field.label.toLowerCase()} is required`
                }
            }
            if (
                field.type === "radio" &&
                value === "other" &&
                (!formData[`${field.name}_other`] || (typeof formData[`${field.name}_other`] === 'string' && formData[`${field.name}_other`].trim() === ""))
            ) {
                newErrors[field.name] = `${field.label} is required`
            }
            if (
                field.type === "email" &&
                value &&
                !isValidEmail(value as string)
            ) {
                newErrors[field.name] = "Enter a valid email address"
            }
        })
        if (mode === "unsubscribe") {
            const emailField = fields.find((f) => f.type === "email")
            if (emailField) {
                const emailValue = formData[emailField.name]
                if (!emailValue || !isValidEmail(emailValue as string)) {
                    newErrors[emailField.name] = "Enter a valid email address"
                }
            }
        }
        return newErrors
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = e.target

        // Special handling for "other" text inputs to auto-select the parent
        if (name.endsWith("_other") && type === "text") {
            const baseName = name.slice(0, -6) // removes "_other"
            const field = fields.find((f) => f.name === baseName)

            setFormData((prev) => {
                const newState = { ...prev, [name]: value }
                if (field && value) {
                    if (field.type === "radio") {
                        newState[baseName] = "other"
                    } else if (field.type === "checkbox" && field.options) {
                        const values = (newState[baseName] as string[]) || []
                        if (!values.includes("other")) {
                            newState[baseName] = [...values, "other"]
                        }
                    }
                }
                return newState
            })
            return
        }

        setFormData((prev) => {
            const newFormData = { ...prev }
            const field = fields.find((f) => f.name === name)

            if (type === "checkbox") {
                if (field && field.options && field.options.length > 0) {
                    // Checkbox group logic
                    const currentValues = (prev[name] as string[]) || []
                    if (checked) {
                        newFormData[name] = [...currentValues, value]
                    } else {
                        newFormData[name] = currentValues.filter(
                            (v) => v !== value
                        )
                        if (value === "other") {
                            newFormData[`${name}_other`] = ""
                        }
                    }
                } else {
                    // Single checkbox logic
                    newFormData[name] = checked
                }
            } else if (type === "radio") {
                if (prev[name] === value) {
                    newFormData[name] = null // Allows deselecting
                    if (value === "other") {
                        newFormData[`${name}_other`] = ""
                    }
                } else {
                    if (prev[name] === "other") {
                        newFormData[`${name}_other`] = "" // Clear other text
                    }
                    newFormData[name] = value
                }
            } else {
                // Logic for other input types (text, email, etc.)
                newFormData[name] = value
            }
            return newFormData
        })
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const validationErrors = validate()
        setFormError(null)

        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors)
            return
        }
        setErrors({})
        setSubmitting(true)

        const emailField = fields.find((f) => f.type === "email")
        const email = emailField ? (formData[emailField.name] as string) : ""

        if (mode === "unsubscribe") {
            if (!email) {
                setFormError("Email is required to unsubscribe.")
                setSubmitting(false)
                return
            }
            // All other fields are ignored for unsubscribe
            submitData({ email, mode })
        } else {
            const payloadFields: Record<string, any> = {}
            fields.forEach((field) => {
                if (field.type === "email") return
                const { name, type, options } = field
                const value = formData[name]

                if (type === "radio" && value === "other") {
                    payloadFields[name] = formData[`${name}_other`] || null
                } else if (type === "checkbox" && options) {
                    const checkedValues = (value as string[]) || []
                    const finalValues = checkedValues
                        .map((val) =>
                            val === "other"
                                ? formData[`${name}_other`] || null
                                : val
                        )
                        .filter(Boolean)
                    payloadFields[name] = finalValues.join(", ")
                } else if (value !== null && value !== undefined) {
                    payloadFields[name] = value
                }
            })

            const dataToSubmit = {
                email,
                fields: payloadFields,
                groups: groupId ? [groupId] : [],
                mode,
            }
            submitData(dataToSubmit)
        }
    }

    async function submitData(data: Record<string, any>) {
        try {
            const response = await fetch("https://framer-mailerlite-webhook.vercel.app/api/mailerlite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                let errorMessage = "Submission failed."
                const newErrors: Record<string, string> = {}
                try {
                    const errorData = await response.json()
                    errorMessage =
                        errorData.message ||
                        errorData.error ||
                        "An unknown error occurred."
                    if (errorData.errors) {
                        Object.keys(errorData.errors).forEach((key) => {
                            const fieldName = key.startsWith("fields.")
                                ? key.substring(7)
                                : key
                            newErrors[fieldName] = Array.isArray(
                                errorData.errors[key]
                            )
                                ? errorData.errors[key][0]
                                : errorData.errors[key]
                        })
                        setErrors(newErrors)
                    }
                } catch (e) {
                    // Could not parse JSON
                }
                throw new Error(errorMessage)
            }

            setSubmitted(true)
        } catch (error) {
            setFormError(
                error.message ||
                    "There was an error submitting the form. Please try again."
            )
        } finally {
            setSubmitting(false)
        }
    }

    function resetForm() {
        // Reset form data to its initial state
        const initial: Record<string, string | boolean | string[] | null> = {}
        fields.forEach((field) => {
            if (field.type === "checkbox" && field.options) {
                initial[field.name] = []
            } else if (field.type === "checkbox") {
                initial[field.name] = false
            } else if (field.type === "radio") {
                initial[field.name] = null
            } else {
                initial[field.name] = null
            }
        })
        setFormData(initial)

        // Clear errors and submission status
        setErrors({})
        setFormError(null)
        setSubmitted(false)
        setSubmitting(false)
    }

    if (submitted) {
        return (
            <div
                role="alert"
                aria-live="polite"
                style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    fontFamily: typography.fontFamily,
                    minHeight: '88vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxWidth: 480,
                    margin: '0 auto',
                }}
            >
                <h2
                    style={{
                        fontWeight: 400,
                        fontSize: 32,
                        lineHeight: "120%",
                        color: colors.textPrimary,
                        marginTop: 8,
                        marginBottom: 8,
                    }}
                >
                    {mode === "unsubscribe" ? "Unsubscribed" : successHeading}
                </h2>
                <p
                    style={{
                        fontSize: 16,
                        lineHeight: '140%',
                        color: colors.textSecondary,
                        marginTop: 0,
                        marginBottom: 24,
                    }}
                >
                    {mode === "unsubscribe"
                        ? "You have been successfully removed."
                        : successBody}
                </p>
                <button
                    onClick={resetForm}
                    style={{
                        ...styles.button,
                        width: "auto",
                        textTransform: "none",
                        fontSize: 16,
                    }}
                >
                    Submit another response
                </button>
            </div>
        )
    }

    const visibleFields =
        mode === "unsubscribe"
            ? fields.filter((f) => f.type === "email")
            : fields

    // Define a shared style object for radio/checkbox options:
    const optionStyle = (idx: number, optionsLength: number) => ({
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: 0,
        fontWeight: 400,
        fontSize: 16,
        lineHeight: '140%',
        color: colors.textSecondary,
        minHeight: 44,
        minWidth: 44,
        padding: 0,
        position: 'relative',
    });

    return (
        <form
            id={formId}
            onSubmit={handleSubmit}
            noValidate
            style={{
                background: containerFill,
                borderRadius: 16,
                padding: containerPadding,
                fontFamily: "'Poppins', sans-serif",
                color: "rgba(4, 12, 51, 0.7)",
                border: `1.5px solid ${containerBorderColor}`,
            }}
        >
            <div style={{ maxWidth: 480, margin: "0 auto" }}>
                {/* Header and Subheader Stack */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                    }}
                >
                    {title && (
                        <h2
                            style={{
                                fontWeight: 400,
                                fontSize: 32,
                                lineHeight: "120%",
                                marginTop:
                                    Object.keys(errors).length > 0 ? 4 : 8,
                                marginBottom: 0,
                                color: colors.textPrimary,
                            }}
                        >
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p
                            style={{
                                fontSize: 18,
                                lineHeight: '140%',
                                marginTop: 8,
                                marginBottom: Object.keys(errors).length > 0 ? 8 : fieldPadding,
                                color: colors.textSecondary,
                            }}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
                {Object.keys(errors).length > 0 && (
                    <div
                        ref={errorSummaryRef}
                        tabIndex={-1}
                        aria-labelledby="error-summary-title"
                        style={{
                            background: "#fff0f0",
                            padding: "16px",
                            marginBottom: "8px",
                            borderRadius: 8,
                        }}
                    >
                        <h3
                            id="error-summary-title"
                            style={{ marginTop: 0, marginBottom: 2, fontSize: 14 }}
                        >
                            Please complete required fields.
                        </h3>
                        <div>
                            {Object.entries(errors).map(
                                ([field, message]) => (
                                    <div
                                        key={field}
                                        style={{ marginBottom: 4 }}
                                    >
                                        <span style={{ fontWeight: 500 }}>
                                            <a
                                                href={`#${field}`}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "#ff0000",
                                                    fontSize: 14,
                                                }}
                                            >
                                                {message}
                                            </a>
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
                {/* Form Fields Stack */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: `${fieldPadding}px`,
                        marginBottom: "32px",
                    }}
                >
                    {visibleFields
                        .filter((f) => f.name !== "gdprConsent")
                        .map(
                            ({
                                name,
                                label,
                                required,
                                type,
                                hint,
                                options,
                                allowOther,
                            }, index) => (
                                <div key={name}>
                                    <label
                                        id={`${name}-label`}
                                        htmlFor={name}
                                        style={{
                                            display: "block",
                                            fontWeight: 600,
                                            fontSize: 16,
                                            marginBottom: 0,
                                            color: colors.textPrimary,
                                        }}
                                    >
                                        {label}
                                        {required && " *"}
                                    </label>
                                    {hint && (
                                        <div
                                            id={`${name}-hint`}
                                            style={{
                                                fontSize: 16,
                                                color: 'rgba(3, 9, 38, 0.8)',
                                                marginTop: 4,
                                            }}
                                        >
                                            {hint}
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            minHeight: "20px",
                                            marginTop: "2px",
                                            marginBottom: errors[name]
                                                ? "2px"
                                                : "0",
                                            transition: "min-height 0.2s",
                                        }}
                                    >
                                        {errors[name] && (
                                            <div
                                                id={`${name}-error`}
                                                style={{
                                                    color: colors.errorRed,
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    marginBottom: "2px",
                                                }}
                                                role="alert"
                                            >
                                                {errors[name]}
                                            </div>
                                        )}
                                    </div>
                                    {type === "radio" && options && (
                                        <div
                                            role="radiogroup"
                                            aria-labelledby={`${name}-label`}
                                            aria-describedby={errors[name] ? `${name}-error` : hint ? `${name}-hint` : undefined}
                                            style={{ paddingLeft: 0 }}
                                        >
                                            {options.map((opt, idx) => (
                                                <label
                                                    key={opt.value}
                                                    style={optionStyle(idx, options.length + (allowOther ? 1 : 0))}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={name}
                                                        value={opt.value}
                                                        checked={formData[name] === opt.value}
                                                        onChange={e => {
                                                            setFormData(prev => ({ ...prev, [name]: opt.value }))
                                                        }}
                                                        required={required}
                                                        aria-required={required}
                                                        style={{ marginTop: 2 }}
                                                    />
                                                    {opt.label}
                                                </label>
                                            ))}
                                            {allowOther && (
                                                <label
                                                    style={optionStyle(options.length, options.length + 1)}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={name}
                                                        value="other"
                                                        checked={formData[name] === 'other'}
                                                        onChange={e => {
                                                            if (formData[name] === 'other') {
                                                                setFormData(prev => ({ ...prev, [name]: null }))
                                                            } else {
                                                                setFormData(prev => ({ ...prev, [name]: 'other' }))
                                                            }
                                                        }}
                                                        required={required}
                                                        aria-required={required}
                                                        style={{ marginTop: 2 }}
                                                    />
                                                    Other:
                                                    <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                                        <input
                                                            type="text"
                                                            className="other-text-input"
                                                            name={`${name}_other`}
                                                            value={(formData[`${name}_other`] as string) || ""}
                                                            onChange={handleChange}
                                                            disabled={formData[name] !== 'other'}
                                                            style={{ marginTop: 2 }}
                                                        />
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                    )}
                                    {type === "checkbox" && options && (
                                        <div
                                            role="group"
                                            aria-labelledby={name}
                                            style={{ paddingLeft: 0 }}
                                        >
                                            {options.map((opt, idx) => {
                                                const isChecked = Array.isArray(formData[name])
                                                    ? (formData[name] as string[]).includes(opt.value)
                                                    : false
                                                return (
                                                    <label
                                                        key={opt.value}
                                                        style={optionStyle(idx, options.length + (allowOther ? 1 : 0))}
                                                    >
                                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, marginRight: 12, position: 'relative', marginTop: 2 }}>
                                                            <input
                                                                type="checkbox"
                                                                name={name}
                                                                value={opt.value}
                                                                checked={isChecked}
                                                                onChange={handleChange}
                                                                required={required && (!Array.isArray(formData[name]) || (formData[name] as string[]).length === 0)}
                                                                aria-required={required}
                                                                style={{
                                                                    position: 'absolute',
                                                                    opacity: 0,
                                                                    width: 20,
                                                                    height: 20,
                                                                    left: 0,
                                                                    top: 0,
                                                                    margin: 0,
                                                                    zIndex: 1,
                                                                    cursor: 'pointer',
                                                                }}
                                                            />
                                                            <span style={{
                                                                width: 20,
                                                                height: 20,
                                                                borderRadius: 4,
                                                                border: `1.5px solid ${isChecked ? colors.brandBlue : 'rgba(6, 18, 77, 0.45)'}`,
                                                                background: isChecked ? colors.brandBlue : '#fff',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                transition: 'border-color 0.2s, background 0.2s',
                                                            }}>
                                                                {isChecked && (
                                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                                        <polyline points="2,7 5,10 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                        </span>
                                                        {opt.label}
                                                    </label>
                                                )
                                            })}
                                            {allowOther && (
                                                <label
                                                    style={optionStyle(options.length, options.length + 1)}
                                                >
                                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, marginRight: 12, position: 'relative', marginTop: 2 }}>
                                                        <input
                                                            type="checkbox"
                                                            name={name}
                                                            value="other"
                                                            checked={Array.isArray(formData[name]) ? (formData[name] as string[]).includes('other') : false}
                                                            onChange={handleChange}
                                                            style={{
                                                                position: 'absolute',
                                                                opacity: 0,
                                                                width: 20,
                                                                height: 20,
                                                                left: 0,
                                                                top: 0,
                                                                margin: 0,
                                                                zIndex: 1,
                                                                cursor: 'pointer',
                                                            }}
                                                        />
                                                        <span style={{
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: 4,
                                                            border: `1.5px solid ${Array.isArray(formData[name]) && (formData[name] as string[]).includes('other') ? colors.brandBlue : 'rgba(6, 18, 77, 0.45)'}`,
                                                            background: Array.isArray(formData[name]) && (formData[name] as string[]).includes('other') ? colors.brandBlue : '#fff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transition: 'border-color 0.2s, background 0.2s',
                                                        }}>
                                                            {Array.isArray(formData[name]) && (formData[name] as string[]).includes('other') && (
                                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                                    <polyline points="2,7 5,10 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            )}
                                                        </span>
                                                    </span>
                                                    Other:
                                                    <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                                        <input
                                                            type="text"
                                                            className="other-text-input"
                                                            name={`${name}_other`}
                                                            value={(formData[`${name}_other`] as string) || ""}
                                                            onChange={handleChange}
                                                            disabled={!(Array.isArray(formData[name]) && (formData[name] as string[]).includes('other'))}
                                                            style={{ marginTop: 2 }}
                                                        />
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                    )}
                                    {/* Fallback for other types */}
                                    {(!["radio", "checkbox"].includes(type) ||
                                        !options) && (
                                        <input
                                            id={name}
                                            name={name}
                                            type={type}
                                            required={required}
                                            aria-required={required}
                                            aria-invalid={!!errors[name]}
                                            aria-describedby={
                                                errors[name]
                                                    ? `${name}-error`
                                                    : hint
                                                      ? `${name}-hint`
                                                      : undefined
                                            }
                                            value={
                                                (formData[name] as string) || ""
                                            }
                                            checked={
                                                type === "checkbox"
                                                    ? (formData[name] as boolean)
                                                    : undefined
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    e
                                                )
                                            }
                                            style={{
                                                width: "100%",
                                                height: 48,
                                                padding: "12px 16px",
                                                border: errors[name]
                                                    ? "2px solid #ff0000"
                                                    : "1.5px solid rgba(6, 18, 77, 0.45)",
                                                borderRadius: 8,
                                                fontSize: "16px",
                                                boxSizing: "border-box",
                                                background: "#fafafa",
                                                outline: "none",
                                                marginTop: 2,
                                            }}
                                        />
                                    )}
                                </div>
                            )
                        )}
                </div>
                {/* Marketing Permissions Section */}
                {showMarketingPermissions && (
                    <div
                        style={{
                            marginTop: "32px",
                        }}
                    >
                        <strong
                            style={{
                                color: colors.textPrimary,
                                fontSize: 14,
                                lineHeight: "20px",
                                fontWeight: 600,
                            }}
                        >
                            {marketingPermissionsTitle}
                        </strong>
                        <p
                            style={{
                                fontSize: 16,
                                lineHeight: '140%',
                                margin: "4px 0 0 0",
                                color: colors.textSecondary,
                            }}
                        >
                            {marketingPermissionsText}
                        </p>
                    </div>
                )}
                {formError && (
                    <div
                        style={{
                            color: colors.errorRed,
                            marginBottom: 16,
                            textAlign: "center",
                            fontWeight: 500,
                        }}
                        role="alert"
                    >
                        {formError}
                    </div>
                )}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            width: '100%',
                            maxWidth: 360,
                            height: 48,
                            padding: '0 24px',
                            fontSize: 14,
                            lineHeight: '20px',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            fontFamily: "'Poppins', sans-serif",
                            textTransform: 'uppercase',
                            backgroundColor: '#143cff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 32,
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            marginTop: '24px',
                            marginBottom: '16px',
                        }}
                        aria-busy={submitting}
                    >
                        {submitting
                            ? 'Submitting...'
                            : mode === 'unsubscribe'
                                ? 'Unsubscribe'
                                : submitButtonText}
                    </button>
                </div>
                {/* Privacy Policy Acknowledgment */}
                {mode === "subscribe" && (
                    <p
                        style={{
                            fontSize: 16,
                            lineHeight: '140%',
                            color: colors.textSecondary,
                        }}
                    >
                        <span style={{ fontSize: 16, lineHeight: '140%' }}>
                            By clicking below to submit this form, you
                            acknowledge that the information you provide will be
                            processed in accordance with our{' '}
                            <a
                                href="https://www.onespring.net/privacy-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: colors.brandBlue, textDecoration: 'underline' }}
                            >
                                Privacy Policy
                            </a>
                            .
                        </span>
                    </p>
                )}
            </div>
        </form>
    )
}

MailerLiteForm.defaultProps = {
    formId: "default-form-id",
    title: "Subscribe to our newsletter",
    subtitle: "Get updates and news delivered to your inbox.",
    fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
    ],
}

// Add Framer property controls for visual editing in Framer UI
addPropertyControls(MailerLiteForm, {
    mode: {
        type: ControlType.Enum,
        title: "Form Mode",
        options: ["subscribe", "unsubscribe"],
        optionTitles: ["Subscribe/Preferences", "Unsubscribe"],
        defaultValue: "subscribe",
    },
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Subscribe to our newsletter",
    },
    subtitle: {
        type: ControlType.String,
        title: "Subtitle",
        defaultValue:
            "Get OneSpring news, updates, and insights delivered to your inbox.",
    },
    submitButtonText: {
        type: ControlType.String,
        title: "Button Text",
        defaultValue: "Submit",
    },
    fields: {
        type: ControlType.Array,
        title: "Fields",
        propertyControl: {
            type: ControlType.Object,
            controls: {
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Name",
                },
                name: {
                    type: ControlType.Enum,
                    title: "Field Name (API)",
                    options: mailerlite_field_keys.map(f => f.key),
                    optionTitles: mailerlite_field_keys.map(f => f.label),
                    defaultValue: "name",
                },
                type: {
                    type: ControlType.Enum,
                    title: "Type",
                    options: [
                        "text",
                        "email",
                        "checkbox",
                        "radio",
                        "select",
                        "number",
                        "tel",
                    ],
                    optionTitles: [
                        "Text",
                        "Email",
                        "Checkbox",
                        "Radio",
                        "Dropdown",
                        "Number",
                        "Tel",
                    ],
                    defaultValue: "text",
                },
                required: {
                    type: ControlType.Boolean,
                    title: "Required",
                    defaultValue: false,
                },
                hint: { type: ControlType.String, title: "Hint" },
                options: {
                    type: ControlType.Array,
                    title: "Options",
                    propertyControl: {
                        type: ControlType.Object,
                        controls: {
                            label: { type: ControlType.String, title: "Label" },
                        },
                    },
                    defaultValue: [],
                    hidden: (props) => !(props.type === "radio" || props.type === "checkbox"),
                },
                allowOther: {
                    type: ControlType.Boolean,
                    title: "Allow Other",
                    defaultValue: false,
                    hidden: (props) => !(props.type === "radio" || props.type === "checkbox"),
                },
            },
        },
        defaultValue: [
            {
                label: "Name",
                name: "name",
                type: "text",
                required: true,
                hint: "",
            },
            {
                label: "Email",
                name: "email",
                type: "email",
                required: true,
                hint: "",
            },
        ],
    },
    groupId: {
        type: ControlType.Enum,
        title: "Group",
        options: group_options.map((g) => g.id),
        optionTitles: group_options.map((g) => g.name),
        defaultValue: group_options[0].id,
    },
    containerFill: {
        type: ControlType.Color,
        title: "Fill",
        defaultValue: "#fff",
    },
    containerPadding: {
        type: ControlType.String,
        title: "Container Padding",
        defaultValue: "24px 24px 40px 24px",
    },
    fieldPadding: {
        type: ControlType.Number,
        title: "Field Gap",
        defaultValue: 24,
        min: 0,
        max: 100,
        unit: "px",
    },
    containerBorderColor: {
        type: ControlType.Color,
        title: "Border",
        defaultValue: "rgba(6, 18, 77, 0.45)",
    },
    showMarketingPermissions: {
        type: ControlType.Boolean,
        title: "Show Marketing Section",
        defaultValue: true,
    },
    marketingPermissionsTitle: {
        type: ControlType.String,
        title: "Marketing Title",
        defaultValue: "Marketing Permissions",
        hidden: (props) => !props.showMarketingPermissions,
    },
    marketingPermissionsText: {
        type: ControlType.String,
        title: "Marketing Text",
        defaultValue:
            "The information you provide on this form will only be used to provide you with updates and personalized marketing.",
        hidden: (props) => !props.showMarketingPermissions,
    },
    successHeading: {
        type: ControlType.String,
        title: "Success Heading",
        defaultValue: "Success!",
    },
    successBody: {
        type: ControlType.String,
        title: "Success Body",
        defaultValue: "Your form was submitted.",
    },
})
