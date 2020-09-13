import { Meteor } from 'meteor/meteor'
import sendGrid from 'sendgrid'
import {
    SendGrid,
    SendGridContent,
    SendGridEmail,
    SendGridMail,
    SendGridPersonalization,
    SendGridResponse,
    SendGridSubstitution,
} from './send-grid'

/**
 * The base class for emails.
 * @class Email
 */
export abstract class Email {
    //constants
    public static FROM_EMAIL = 'notifications@sharedphotoalbum.com'
    public static FROM_NAME = 'Notifications'
    public static TO_EMAIL = 'test@example.com'
    public static TO_NAME = 'Test Test'

    //the config
    // protected configuration: IConfiguration

    //the SendGrid API
    protected sendGrid: SendGrid

    //the SendGrid Mail helper
    protected _mail: any

    /**
     * @constructor
     */
    constructor() {
        //get configuration object
        // this.configuration = ConfigurationFactory.config()

        //store the SendGrid API
        this.sendGrid = sendGrid(Meteor.settings.sendGrid.apiKey)

        //set default from email address(es)
        this.setFromString(Email.FROM_EMAIL, Email.FROM_NAME)
    }

    /**
     * Returns the Contents array.
     * @method get contents
     * @return {SendGridContent[]}
     */
    public get contents(): SendGridContent[] {
        return this.mail.getContents()
    }

    /**
     * Returns the from Email object.
     * @return {SendGridEmail}
     */
    public get from(): SendGridEmail {
        return this.mail.getFrom()
    }

    /**
     * Set the from email and name.
     * @method set from
     * @param {SendGridEmail} from
     */
    public set from(from: SendGridEmail) {
        this.mail.setFrom(from)
    }

    /**
     * Returns the populated SendGrid.mail.Email helper object.
     * @method get mail
     * @return {SendGridMail}
     */
    public get mail(): SendGridMail {
        //return existing mail object
        if (this._mail !== undefined) {
            return this._mail
        }

        //set mail helper
        this._mail = new SendGridMail()

        return this._mail
    }

    /**
     * Returns the SendGrid Personalization object.
     * @method get personalization
     * @return {SendGridPersonalization}
     */
    public get personalization(): SendGridPersonalization {
        //verify personalization exists
        if (this.mail.getPersonalizations() === undefined || this.mail.getPersonalizations().length === 0) {
            this.mail.addPersonalization(new SendGridPersonalization())
        }

        //get first personalization by default
        const personalizations = this.mail.getPersonalizations()
        return personalizations[0]
    }

    /**
     * Returns the subject for this email.
     * @method get subject
     * @return {string}
     */
    public get subject(): string {
        return this.mail.getSubject()
    }

    /**
     * Set the subject for this email.
     * @method set subject
     * @param {string} subject
     */
    public set subject(subject: string) {
        this.mail.setSubject(subject)
    }

    /**
     * Return the substitutions.
     * @method get substitution
     * @return {SendGridSubstitution[]}
     */
    public get substitutions(): { [key: string]: string } {
        return this.personalization.getSubstitutions()
    }

    /**
     * Add content to this email.
     * @method addContent
     * @param {SendGridContent} content
     * @return {Email}
     */
    public addContent(content: SendGridContent): Email {
        //add content to Mail helper
        this.mail.addContent(content)

        return this
    }

    /**
     * Add content to this email from a simple string. The default type is "text/html".
     * @method addContentString
     * @param {string} value
     * @param {string} type
     * @return {Email}
     */
    public addContentString(value: string, type = 'text/html'): Email {
        //build content
        const content: SendGridContent = {
            type: type,
            value: value,
        }

        //add content to Mail helper
        this.addContent(content)

        return this
    }

    /**
     * Add to address using simple values.
     * @method addTo
     * @param {string} email
     * @param {string} name
     * @return {Email}
     */
    public addTo(email: string, name?: string): Email {
        //create Email
        const to: SendGridEmail = {
            email,
            name,
        }
        if (name !== undefined) {
            to.name = name
        }

        //add to Mail helper
        this.personalization.addTo(to)

        return this
    }

    /**
     * Add a substitution in the email template.
     * @method addSubstitution
     * @param {string} key
     * @param {string} value
     * @return {Email}
     */
    public addSubstitution(key: string, value: string): Email {
        const substition: SendGridSubstitution = {
            key,
            value,
        }
        this.personalization.addSubstitution(substition)

        return this
    }

    /**
     * Post-send hook.
     * @method postSend
     * @abstract
     */
    abstract post()

    /**
     * Pre-send hook.
     * @method preSend
     * @abstract
     */
    abstract pre()

    /**
     * Send the email.
     * @method send
     * @abstract
     */
    abstract send(): Promise<SendGridResponse>

    /**
     * Set from using simple values.
     * @method setFromString
     * @param {string} email
     * @param {string} name
     * @return {Email}
     */
    public setFromString(email: string, name?: string): Email {
        //create Email
        const from: SendGridEmail = {
            email,
            name,
        }
        if (name !== undefined) {
            from.name = name
        }

        //set from property
        this.from = from

        return this
    }
}
