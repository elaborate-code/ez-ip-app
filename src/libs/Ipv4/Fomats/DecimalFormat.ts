export default class DecimalFormat {
    value: string
    arr: [number, number, number, number]

    constructor(decimalIp: string) {
        if (!DecimalFormat.isValidDecimalIp(decimalIp)) {
            throw new Error(`Invalid decimal IPv4 address ${decimalIp}`)
        }

        this.value = decimalIp
        this.arr = this.value.split('.').map((octet) => parseInt(octet, 10)) as [
            number,
            number,
            number,
            number
        ]
    }

    static isValidDecimalIp(decimalIp: string): boolean {
        const octets = decimalIp.split('.')
        if (octets.length !== 4) {
            return false
        }

        return octets.every(
            (octet) => /^\d+$/.test(octet) && parseInt(octet, 10) >= 0 && parseInt(octet, 10) <= 255
        )
    }

    // toBinary(): string {
    // }
}
