## IPv4

-   32 bits value

IP addresses can be represented in different numbering systems for different purposes, such as **binary** for bitwise operations, **octal** for simplifying calculations (add/substract), **decimal** for human readability, and **hexadecimal** for compactness.

### Bits

| 00000000 | 00000001 | 00000010 | 00000100 | 00001000 | 00010000 | 00100000 | 0100000 | 10000000 |
| -------- | -------- | -------- | -------- | -------- | -------- | -------- | ------- | -------- |
| 0        | 1        | 2        | 4        | 8        | 16       | 32       | 64      | 128      |

### Conversions

![network-addressing-info-graph](./network-addressing-info-graph.png)

#### Mask

Ones to the left (network part) and zeroes to the right (hosts part)

```
11111111000000000000000000000000
```

```
11111111111111111111111111111111 = 255.255.255.255
11111111000000000000000000000000 = 255.0.0.0
11111110000000000000000000000000 = 254.0.0.0
11111100000000000000000000000000 = 252.0.0.0
11111000000000000000000000000000 = 248.0.0.0
11110000000000000000000000000000 = 240.0.0.0
11100000000000000000000000000000 = 224.0.0.0
11000000000000000000000000000000 = 192.0.0.0
10000000000000000000000000000000 = 128.0.0.0
00000000000000000000000000000000 = 0.0.0.0
```

> Only these decimal numbers may appear in a mask: `0`, `128`, `192`, `224`, `240`, `248`, `252`, `254`, `255`

#### Wildcard Mask

Reverse of mask

```
11111111000000000000000000000000 -> 00000000111111111111111111111111
```

```
00000000000000000000000011111111 = 0.0.0.255
00000000000000000000000001111111 = 0.0.0.127
00000000000000000000000000111111 = 0.0.0.63
00000000000000000000000000011111 = 0.0.0.31
00000000000000000000000000001111 = 0.0.0.15
00000000000000000000000000000111 = 0.0.0.7
00000000000000000000000000000011 = 0.0.0.3
00000000000000000000000000000001 = 0.0.0.1
00000000000000000000000000000000 = 0.0.0.0
```

> Only these decimal numbers may appear in a wildcard mask: `255`, `127`, `63`, `31`, `15`, `7`, `3`, `1`, `0`

#### Prefix

Count of ones in a mask

```
11111111000000000000000000000000 -> 8
11111111111111110000000000000000 -> 16
11111111111111111111111100000000 -> 24
```

#### Size

How many hosts a network can contain (not including network and broadcast addresses)

```
(2^COUNT_OF_ZEROES_IN_MASK) -2
(2^(32 - prefix)) - 2
```

#### Network address

Any address bitwise AND mask

| A   | B   | A AND B |
| --- | --- | ------- |
| 0   | 0   | 0       |
| 0   | 1   | 0       |
| 1   | 0   | 0       |
| 1   | 1   | 1       |

```
192.168.1.3 AND 255.255.255.0 -> 192.168.1.0
```

> network addresses always end with 0 in binary

#### First host

Network address +1

```
192.168.1.0/24 -> 192.168.1.1
```

#### Broadcast address

Any address bitwise OR wildcard mask

| A   | B   | A OR B |
| --- | --- | ------ |
| 0   | 0   | 0      |
| 0   | 1   | 1      |
| 1   | 0   | 1      |
| 1   | 1   | 1      |

```
192.168.1.0 OR 0.0.0.255 -> 192.168.1.255
```

#### Last host

Broadcast address -1

```
192.168.1.255/24 -> 192.168.1.254
```
