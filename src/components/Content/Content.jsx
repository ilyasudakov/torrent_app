import React, { useEffect, useContext, useState } from 'react'
import './Content.scss'
// import folderOpenIcon from '../../assets/folder-open-line.svg'
import folderClosedIcon from '../../assets/folder-line.svg'
import downloadIcon from '../../assets/download.svg'
import uploadIcon from '../../assets/upload.svg'
import fileIcon from '../../assets/file-earmark.svg'
import linkIcon from '../../assets/link-outlined.svg'

import { UserContext } from '../../App'

const Content = (props) => {
  const userContext = useContext(UserContext)
  const [torrents, setTorrents] = useState([])
  const [previewTorrent, setPreviewTorrent] = useState(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    const torrentCallback = (torrent) => {
      // Torrents can contain many files. Let's use the .mp4 file
      setDataLoaded(true)

      setTorrents([
        ...torrents,
        {
          ...torrent,
          filesHidden: true,
        },
      ])

      const onProgress = () => {
        console.log(torrents)
        let newTorrents = torrents
        newTorrents.splice(torrents.length - 1, 1, {
          ...torrent,
          downloadSpeed: torrent.downloadSpeed / 1000,
          uploadSpeed: torrent.uploadSpeed / 1000,
          filesHidden:
            torrents.length > 0
              ? torrents[torrents.length - 1].filesHidden
              : true,
        })
        setTorrents((torrents) => {
          return [...newTorrents]
        })
      }

      //   console.log(torrents)
      setInterval(onProgress, 1000)
      onProgress()
    }

    if (userContext?.userData?.client && !dataLoaded) {
      const torrentId =
        'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'

      userContext.userData.client.add(torrentId, (torrent) =>
        torrentCallback(torrent),
      )
    }
  }, [dataLoaded, userContext, torrents, previewTorrent])

  return (
    <div className="content">
      <div className="content__title">Торрент Клиент</div>
      {/* {previewTorrent ? ( */}
      <div className="content__preview-wrapper">
        <div id="preview-wrapper__player"></div>
        <div className="preview-wrapper__file-info">
          {previewTorrent
            ? previewTorrent.files.find(function (file) {
                return file.name.endsWith('.mp4')
              }).name
            : null}
        </div>
      </div>
      {/* ) : null} */}
      <div className="content__controls">
        <div className="content__button">
          <img className="content__img" src={fileIcon} alt="" />
          Открыть торрент-файл
        </div>
        <div className="content__button">
          <img className="content__img" src={linkIcon} alt="" />
          Ссылка на торрент
        </div>
      </div>
      <TorrentList
        torrents={torrents}
        hideTorrents={(id) => {
          let newTorrents = torrents

          newTorrents[id].filesHidden = !newTorrents[id].filesHidden

          setTorrents([...newTorrents])
        }}
        previewTorrent={(id) => {
          setPreviewTorrent({
            ...torrents[id],
          })

          let myNode = document.getElementById('preview-wrapper__player')
          while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild)
          }

          torrents[id].files
            .find(function (file) {
              return file.name.endsWith('.mp4')
            })
            .appendTo('#preview-wrapper__player')
        }}
      />
    </div>
  )
}

export default Content

const TorrentList = (props) => {
  useEffect(() => {}, [props.torrents])

  return (
    <div className="torrent-list">
      {props.torrents
        ? props.torrents.map((torrent, index) => (
            <div className="torrent-list__item" key={index}>
              <div className="torrent-list__main">
                <div
                  className="torrent-list__picture"
                  onClick={() => props.previewTorrent(index)}
                >
                  {torrent.files.find(
                    (file) =>
                      file.name.endsWith('.jpeg') ||
                      file.name.endsWith('.jpg') ||
                      file.name.endsWith('.png'),
                  ) ? (
                    <img
                      className="torrent-list__img"
                      src={folderClosedIcon}
                      alt=""
                    />
                  ) : null}
                </div>
                <div className="torrent-list__torrent-info">
                  <div className="torrent-list__name">{torrent.name}</div>
                  <div className="torrent-list__status-bar">
                    <div className="torrent-list__speed">
                      <img
                        className="torrent-list__img"
                        src={downloadIcon}
                        alt=""
                      />
                      {`${Math.round(torrent.downloadSpeed)} KBytes/sec`}
                    </div>
                    <div className="torrent-list__speed">
                      <img
                        className="torrent-list__img"
                        src={uploadIcon}
                        alt=""
                      />
                      {`${Math.round(torrent.uploadSpeed)} KBytes/sec`}
                    </div>
                  </div>
                </div>
                <div className="torrent-list__actions">
                  <div className="torrent-list__action">Открыть</div>
                  <div className="torrent-list__action">Удалить</div>
                  <div
                    className="torrent-list__action"
                    onClick={() => props.hideTorrents(index)}
                  >
                    Файлы
                  </div>
                </div>
              </div>
              <div
                className={`torrent-list__sub-list ${
                  torrent.filesHidden ? 'torrent-list__sub-list--hidden' : ''
                }`}
              >
                <div className="torrent-list">
                  {torrent.files.map((file, fileIndex) => (
                    <div className="torrent-list__file-item" key={fileIndex}>
                      <div className="torrent-list__torrent-info">
                        <div className="torrent-list__name">{file.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        : null}
    </div>
  )
}
