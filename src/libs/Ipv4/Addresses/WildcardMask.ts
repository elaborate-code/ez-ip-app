import type DecimalFormat from '@/libs/Ipv4/Formats/DecimalFormat'
import type BinaryFormat from '@/libs/Ipv4/Formats/BinaryFormat'
import AddressIpv4 from '@/libs/Ipv4/Addresses/AddressIpv4'
import BroadcastAddressIpv4 from '@/libs/Ipv4/Addresses/BroadcastAddressIpv4'
import MaskIpv4 from '@/libs/Ipv4/Addresses/MaskIpv4'
import Prefix from '@/libs/Ipv4/Addresses/Prefix'

export default class WildcardMask extends AddressIpv4 {
    constructor(address: DecimalFormat | BinaryFormat) {
        super(address)

        if (!this.binaryValue.isWildCardMask()) {
            throw new Error(`Invalid wildcard mask value ${this.binaryValue.value}`)
        }
    }

    makeMask(): MaskIpv4 {
        return new MaskIpv4(this.binaryValue.invert())
    }

    makeBroadcastAddress(ip: AddressIpv4): BroadcastAddressIpv4 {
        return new BroadcastAddressIpv4(this.binaryValue.bitwiseOr(ip.binaryValue))
    }

    makePrefix(): Prefix {
        return new Prefix(
            this.binaryValue.value.split('').reduce((sum, bit) => sum + (bit === '0' ? 1 : 0), 0)
        )
    }
}
