export default class ServerConnection {
    /**
     *
     * @param schema
     * @param hostname
     * @param port
     */
    constructor(schema = ServerConnection.SCHEMA, hostname = ServerConnection.HOSTNAME, port = ServerConnection.PORT) {
        this._schema = schema;
        this._hostname = hostname;
        this._port = port;
    }

    /**
     *
     * @returns {string}
     */
    getUrl() {
        return `${this._schema}://${this._hostname}:${this._port}`;
    }

    /**
     *
     * @returns {string|*}
     */
    get schema() {
        return this._schema;
    }

    /**
     *
     * @param value {string|*}
     */
    set schema(value) {
        this._schema = value;

        return this;
    }

    /**
     *
     * @returns {string|*}
     */
    get hostname() {
        return this._hostname;
    }

    /**
     *
     * @param value {string|*}
     */
    set hostname(value) {
        this._hostname = value;

        return this;
    }

    /**
     *
     * @returns {*|string}
     */
    get port() {
        return this._port;
    }

    /**
     *
     * @param value {*|string}
     *
     */
    set port(value) {
        this._port = value;

        return this;
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get SCHEMA() {
        return 'http';
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get HOSTNAME() {
        return 'localhost';
    }

    /**
     *
     * @returns {string}
     * @constructor
     */
    static get PORT() {
        return '3000';
    }
}