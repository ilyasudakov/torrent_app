import WebTorrent from 'webtorrent'

export const initClient = () => {
  return new WebTorrent()
}
