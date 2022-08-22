import * as os from 'os'
import { v4 } from 'default-gateway'

declare interface Address {
  ip: string
  mac: string
}

export const getInterfaceName = (ip?: string): string => {
  if (!ip) {
    return v4.sync().interface
  }

  const interfaces = os.networkInterfaces()

  for (const name in interfaces) {
    const info = interfaces[name] as os.NetworkInterfaceInfo[]
    for (const addr of info) {
      if (addr.address === ip) {
        return name
      }
    }
  }
  throw new Error('invalid ip address')
}

export const address = (
  name: string = getInterfaceName(),
  family: string = 'IPv4'
): Address => {
  const interfaces = os.networkInterfaces()
  const info: os.NetworkInterfaceInfo[] | undefined = interfaces[name]
  if (!info) {
    throw new Error(`invalid interface name: ${name}`)
  }

  for (const addr of info) {
    if (addr.family === family) {
      return {
        ip: addr.address,
        mac: addr.mac
      }
    }
  }

  throw new Error(`invalid family type: ${family}`)
}

export const getIPv4 = (name?: string): string => {
  return address(name).ip
}

export const getIPv6 = (name?: string): string => {
  return address(name, 'IPv6').ip
}

export const getMac = (name?: string): string => {
  return address(name).mac
}

export const getHardwareAddress = (name?: string): Buffer => {
  let mac: string = getMac(name)
  mac = mac
    .split(/[-:]/g)
    .map((item) => item.padStart(2, '0'))
    .join('')
  return Buffer.from(mac, 'hex')
}
