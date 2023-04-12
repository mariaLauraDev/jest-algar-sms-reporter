const stripAnsi = require('strip-ansi');
const axios = require('axios');

class AlgarSmsReporter {
    constructor(globalConfig, reporterOptions, reporterContext) {
        this._globalConfig = globalConfig;
        this._context = reporterContext;
        this._timeZone = reporterOptions.timeZone || 'America/New_York';
        this._reportIfSuccess = reporterOptions.reportIfSuccess || false;
        
        if (!reporterOptions.phones) {
            throw new Error('\nPlease set an phone number array to jest-discord-bridge in jest.config.js');
        }

        if (!reporterOptions.algarPath) {
            throw new Error('\nPlease set an algarPath jest-discord-bridge in jest.config.js');
        }

        if (!reporterOptions.algarAuth) {
            throw new Error('\nPlease set an algarPath jest-discord-bridge in jest.config.js');
        }
        
        this._algarOptions = {
            from: reporterOptions.from || 'Jest Reporter',
            phones: reporterOptions.phones,
            algarPath: reporterOptions.algarPath,
            algarAuth: reporterOptions.algarAuth,
        };
    }

    onRunComplete(test, runResults) {
        let date = new Date();
        let testDateTime = date.toLocaleString('en-US', {timeZone: this._timeZone});

        // collect failure messages
        const failureMessages = runResults.testResults.reduce((acc, { failureMessage }) => {
            if (failureMessage) {
                acc.push(stripAnsi(failureMessage));
            }

            return acc;
        }, []);

        // send messages to phones according to the test results and test date and time
        if (failureMessages.length) {
            if (failureMessages.join('\n').length <= 1519  && failureMessages) {
                const text = `SITE ALERT: Test date and time: ${testDateTime}\n ${failureMessages.join('\n')}`
                this._algarOptions.phones.forEach(async phone => {
                    phone = phone.replace(/\D/g, '');
                    const payload = {
                        from: this._algarOptions.from,
                        to: phone,
                        text: text,
                    };
                    const options = {
                        headers: {
                            Authorization: this._algarOptions.algarAuth,
                        },
                        data: payload,
                    };
                    await axios.post(`http://api.messaging-service.com/${this._algarOptions.algarPath}`, payload, options);
                })
            } else {
                const text = `SITE ALERT: Test date and time: ${testDateTime}\nTotal tests failed: ${runResults.testResults[0].numFailingTests}\nThe error message is too big to send via sms.`
                this._algarOptions.phones.forEach(async phone => {
                    phone = phone.replace(/\D/g, '');
                    const payload = {
                        from: this._algarOptions.from,
                        to: phone,
                        text: text,
                      };
                    const options = {
                        headers: {
                            Authorization: this._algarOptions.algarAuth,
                        },
                        data: payload,
                    };
                    await axios.post(`http://api.messaging-service.com/${this._algarOptions.algarPath}`, payload, options);
                 })
            }
        } else if (this._reportIfSuccess) {
            const text = `SITE STATUS: Test date and time: ${testDateTime}\n All tests passed!`
            this._algarOptions.phones.forEach(async phone => {
                phone = phone.replace(/\D/g, '');
                const payload = {
                    from: this._algarOptions.from,
                    to: phone,
                    text: text,
                  };
                const options = {
                    headers: {
                        Authorization: this._algarOptions.algarAuth,
                    },
                    data: payload,
                };
                await axios.post(`http://api.messaging-service.com/${this._algarOptions.algarPath}`, payload, options);
             })
        }
    }
}

module.exports = AlgarSmsReporter;
