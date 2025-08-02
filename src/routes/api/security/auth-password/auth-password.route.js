class SecurityRoute {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this.EntityService = this._services.SecurityAuthPasswordService;
  }

  /**
   * @swagger
   * /security/signup/email/password:
   *   post:
   *      summary: Signup with email and password.
   *      description: Returns an authentication JWT token.
   *      tags:
   *       - Security
   *      requestBody:
   *        description: Security object to be created.
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/SecurityJWT'
   *      responses:
   *       200:
   *         description: OK.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   *             examples:
   *               Success:
   *                 value:
   *                   status: 200
   *                   success: true
   *                   message: Operation completed successfully
   *                   result:
   *                     $ref: '#/components/schemas/SecurityJWT'
   *       500:
   *         description: Something was wrong while you make this action.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   *             examples:
   *               Success:
   *                 value:
   *                   status: 500
   *                   success: false
   *                   message: Something was wrong while you make this action
   *                   result: null
   */
  async signUpPassword({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.signUpPassword({params});
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * @swagger
   * /security/signin/email/password:
   *   post:
   *      summary: Signin with email and password.
   *      description: Returns an authentication JWT token.
   *      tags:
   *       - Security
   *      requestBody:
   *        description: Security object to be created.
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/SecurityJWT'
   *      responses:
   *       200:
   *         description: OK.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   *             examples:
   *               Success:
   *                 value:
   *                   status: 200
   *                   success: true
   *                   message: Operation completed successfully
   *                   result:
   *                     $ref: '#/components/schemas/SecurityJWT'
   *       500:
   *         description: Something was wrong while you make this action.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   *             examples:
   *               Success:
   *                 value:
   *                   status: 500
   *                   success: false
   *                   message: Something was wrong while you make this action
   *                   result: null
   */
  async signInPassword({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.signInPassword({params});
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * @swagger
   * /security/password/email/reset:
   *   post:
   *      summary: Request to recover password via email.
   *      description: Sends a recovery link or code to the provided email to help the user reset their password.
   *      tags:
   *       - EmailRecoverPassword
   *      requestBody:
   *        description: Details required to send the recovery link.
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Template'
   *      responses:
   *       200:
   *         description: OK.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   *             examples:
   *               Success:
   *                 value:
   *                   status: 200
   *                   success: true
   *                   message: Operation completed successfully
   *                   result:
   *                     $ref: '#/components/schemas/Template'
   *       500:
   *         description: Something was wrong while you make this action.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   *             examples:
   *               Success:
   *                 value:
   *                   status: 500
   *                   success: false
   *                   message: Something was wrong while you make this action
   *                   result: null
   */
  async resetPassword({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.resetPassword({params});
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * @swagger
   * /security/password/email/new:
   *   patch:
   *      summary: Set a new password.
   *      description: Allows the user to set a new password using the recovery link or code.
   *      tags:
   *       - EmailRecoverPassword
   *      requestBody:
   *        description: New password details and recovery information.
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Template'
   *      responses:
   *       200:
   *         description: OK.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   *             examples:
   *               Success:
   *                 value:
   *                   status: 200
   *                   success: true
   *                   message: Operation completed successfully
   *                   result:
   *                     $ref: '#/components/schemas/Template'
   *       500:
   *         description: Something was wrong while you make this action.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   *             examples:
   *               Success:
   *                 value:
   *                   status: 500
   *                   success: false
   *                   message: Something was wrong while you make this action
   *                   result: null
   */
  async newPassword({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.newPassword({params});
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }
}

module.exports = SecurityRoute;
