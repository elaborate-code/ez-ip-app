import { describe, expect, it } from 'vitest'

import Network from '@/libs/Ipv4/Networks/Network'
import DecimalFormat from '@/libs/Ipv4/Formats/DecimalFormat'
import IpAddress from '@/libs/Ipv4/Addresses/IpAddress'
import Mask from '@/libs/Ipv4/Addresses/Mask'
import NetworkAddress from '@/libs/Ipv4/Addresses/NetworkAddress'

describe('Network', () => {
    describe('subnet construction+getters', () => {
        it.each([
            {
                inputIp: '192.168.1.100',
                mask: '255.255.255.0',
                prefix: 24,
                size: 254,
                wildCardMask: '0.0.0.255',
                networkIp: '192.168.1.0',
                firstHostIp: '192.168.1.1',
                lastHostIp: '192.168.1.254',
                broadcastIp: '192.168.1.255'
            },
            {
                inputIp: '10.0.0.1',
                mask: '255.255.0.0',
                prefix: 16,
                size: 65534,
                wildCardMask: '0.0.255.255',
                networkIp: '10.0.0.0',
                firstHostIp: '10.0.0.1',
                lastHostIp: '10.0.255.254',
                broadcastIp: '10.0.255.255'
            },
            {
                inputIp: '172.16.0.100',
                mask: '255.255.255.128',
                prefix: 25,
                size: 126,
                wildCardMask: '0.0.0.127',
                networkIp: '172.16.0.0',
                firstHostIp: '172.16.0.1',
                lastHostIp: '172.16.0.126',
                broadcastIp: '172.16.0.127'
            },
            {
                inputIp: '192.168.0.1',
                mask: '255.255.255.252',
                prefix: 30,
                size: 2,
                wildCardMask: '0.0.0.3',
                networkIp: '192.168.0.0',
                firstHostIp: '192.168.0.1',
                lastHostIp: '192.168.0.2',
                broadcastIp: '192.168.0.3'
            }
        ])(
            'should correctly calculate the network IP address for %s\n',
            ({
                inputIp,
                mask,
                prefix,
                size,
                wildCardMask,
                networkIp,
                firstHostIp,
                lastHostIp,
                broadcastIp
            }) => {
                const network = new Network(
                    new IpAddress(new DecimalFormat(inputIp)),
                    new Mask(new DecimalFormat(mask))
                )

                expect(network.prefix.value).toEqual(prefix)
                expect(network.size).toEqual(size)
                expect(network.wildcardMask.decimalValue.value).toEqual(wildCardMask)
                expect(network.networkAddress.decimalValue.value).toEqual(networkIp)
                expect(network.firstHostAddress.decimalValue.value).toEqual(firstHostIp)
                expect(network.broadcastAddress.decimalValue.value).toEqual(broadcastIp)
                expect(network.lastHostAddress.decimalValue.value).toEqual(lastHostIp)
            }
        )
    })

    describe('addSubnetBySize', () => {
        it('add subnets to the network', () => {
            const network = new Network(
                new NetworkAddress(new DecimalFormat('10.0.0.0')),
                new Mask(new DecimalFormat('255.255.255.0'))
            )
            network.addSubnetBySize('test1', 4)
            network.addSubnetBySize('test2', 8)

            expect(() => network.addSubnetBySize('test2', 8)).toThrow()

            network.addSubnet(
                'test3',
                new Network(
                    new NetworkAddress(new DecimalFormat('10.0.0.224')),
                    new Mask(new DecimalFormat('255.255.255.252'))
                )
            )

            const expectedSubnet1 = new Network(
                new NetworkAddress(new DecimalFormat('10.0.0.0')),
                new Mask(new DecimalFormat('255.255.255.248'))
            )

            const expectedSubnet2 = new Network(
                new NetworkAddress(new DecimalFormat('10.0.0.8')),
                new Mask(new DecimalFormat('255.255.255.240'))
            )

            expect(network.getSubnet('test1')!.subnet).toEqual(expectedSubnet1)
            expect(network.getSubnet('test2')!.subnet).toEqual(expectedSubnet2)
        })
    })

    describe('containsSubnet', () => {
        const network = new Network(
            new IpAddress(new DecimalFormat('192.168.1.160')), // -> .191
            new Mask(new DecimalFormat('255.255.255.224'))
        )

        it('contains its self', () => {
            expect(network.containsSubnet(network)).toBeTruthy()
        })

        it('returns true for smaller fully contained subnets', () => {
            expect(
                network.containsSubnet(
                    new Network(
                        new IpAddress(new DecimalFormat('192.168.1.168')), // -> .175
                        new Mask(new DecimalFormat('255.255.255.248'))
                    )
                )
            ).toBeTruthy()

            expect(
                network.containsSubnet(
                    new Network(
                        new IpAddress(new DecimalFormat('192.168.1.160')), // -> 167
                        new Mask(new DecimalFormat('255.255.255.248'))
                    )
                )
            ).toBeTruthy()

            expect(
                network.containsSubnet(
                    new Network(
                        new IpAddress(new DecimalFormat('192.168.1.184')), // -> 191
                        new Mask(new DecimalFormat('255.255.255.248'))
                    )
                )
            ).toBeTruthy()
        })

        it('returns false for uncontained networks/subnets', () => {
            expect(
                network.containsSubnet(
                    new Network(
                        new IpAddress(new DecimalFormat('192.168.1.128')), // -> .255
                        new Mask(new DecimalFormat('255.255.255.128'))
                    )
                )
            ).toBeFalsy()

            expect(
                network.containsSubnet(
                    new Network(
                        new IpAddress(new DecimalFormat('192.168.1.160')), // -> 191
                        new Mask(new DecimalFormat('255.255.255.192'))
                    )
                )
            ).toBeFalsy()
        })
    })

    describe('containsAddress', () => {
        const network = new Network(
            new IpAddress(new DecimalFormat('192.168.1.160')), // -> .191
            new Mask(new DecimalFormat('255.255.255.224'))
        )

        it.each([
            { address: '192.168.1.159', contained: false },
            { address: '192.168.1.160', contained: true },
            { address: '192.168.1.188', contained: true },
            { address: '192.168.1.191', contained: true },
            { address: '192.168.1.192', contained: false }
        ])('contains its self', ({ address, contained }) => {
            expect(network.containsAddress(new IpAddress(new DecimalFormat(address)))).toBe(
                contained
            )
        })
    })
})
