import React, { useEffect, useContext, useState } from 'react'
import './Content.scss'

import { UserContext } from '../../App'

const Content = (props) => {
  const userContext = useContext(UserContext)
  const [dataLoaded, setDataLoaded] = useState(false)
  useEffect(() => {
    if (userContext?.userData?.client && !dataLoaded) {
      const torrentId =
        'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'

      let newFile = userContext.userData.client.add(torrentId, (torrent) => {
        // Torrents can contain many files. Let's use the .mp4 file
        var file = torrent.files.find(function (file) {
          return file.name.endsWith('.mp4')
        })

        // Display the file by adding it to the DOM. Supports video, audio, image, etc. files
        file.appendTo('#preview-wrapper__player')

        setDataLoaded(true)

        userContext.setUserData({
          ...userContext.userData,
          torrents: [...userContext.userData.torrents, torrent],
        })
      })
    }
    console.log(userContext.userData)
  }, [dataLoaded, userContext.userData])

  return (
    <div className="content">
      <div className="content__title">Торрент Клиент</div>
      <div className="content__preview-wrapper">
        <div id="preview-wrapper__player"></div>
        <div className="preview-wrapper__file-info">
          {userContext.userData?.torrents?.length > 0
            ? userContext.userData.torrents[0].files.find(function (file) {
                return file.name.endsWith('.mp4')
              }).name
            : null}
        </div>
      </div>
      <TorrentList torrents={userContext.userData?.torrents || null} />
    </div>
  )
}

export default Content

const TorrentList = (props) => {
  useEffect(() => {}, [])

  return (
    <div className="torrent-list">
      {props.torrents
        ? props.torrents.map((torrent, index) => (
            <div className="torrent-list__item" key={index}>
              <div className="torrent-list__picture">
                {torrent.files.find(
                  (file) =>
                    file.name.endsWith('.jpeg') ||
                    file.name.endsWith('.jpg') ||
                    file.name.endsWith('.png'),
                ) ? (
                  <img
                    className="torrent-list__img"
                    src={
                      torrent.files.find(
                        (file) =>
                          file.name.endsWith('.jpeg') ||
                          file.name.endsWith('.jpg') ||
                          file.name.endsWith('.png'),
                      ).path
                    }
                    alt=""
                  />
                ) : null}
              </div>
              <div className="torrent-list__torrent-info">
                <div className="torrent-list__name">{torrent.name}</div>
                <div className="torrent-list__status-bar">
                  <div className="torrent-list__speed">
                    {`${torrent.downloadSpeed} bytes/sec`}
                  </div>
                </div>
              </div>
              <div className="torrent-list__actions">
                <div className="torrent-list__action">Открыть</div>
                <div className="torrent-list__action">Удалить</div>
              </div>
            </div>
          ))
        : null}
    </div>
  )
}
