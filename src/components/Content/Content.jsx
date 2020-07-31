import React, { useEffect, useContext, useState } from 'react'
import './Content.scss'
import folderOpenIcon from '../../assets/folder-open-line.svg'
import folderClosedIcon from '../../assets/folder-line.svg'
import downloadIcon from '../../assets/download.svg'
import uploadIcon from '../../assets/upload.svg'
import fileIcon from '../../assets/file-earmark.svg'
import linkIcon from '../../assets/link-outlined.svg'

import { UserContext } from '../../App'

const Content = (props) => {
  const userContext = useContext(UserContext)
  const [torrents, setTorrents] = useState([])
  const [torrentLink, setTorrentLink] = useState('')
  const [showTorrentLink, setShowTorrentLink] = useState('')
  const [previewTorrent, setPreviewTorrent] = useState(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    if (userContext?.userData?.client && !dataLoaded) {
      setDataLoaded(true)
      const torrentId =
        'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
      addTorrent(torrentId)
    }
    // console.log(userContext.userData)
  }, [dataLoaded, userContext, torrents, previewTorrent])

  const torrentCallback = (torrent) => {
    console.log(torrent)
    const index = torrents.length > 0 ? torrents.length : 0
    setTorrents((torrents) => {
      return [
        ...torrents,
        {
          ...torrent,
          filesHidden: true,
        },
      ]
    })

    const onProgress = () => {
      if (userContext.userData.client.get(torrent.magnetURI) === null) {
        return clearInterval(interval)
      }
      return setTorrents((torrents) => {
        let newTorrents = torrents
        // console.log(torrents[index].filesHidden)
        newTorrents.splice(index, 1, {
          ...torrent,
          downloadSpeed: torrent.downloadSpeed / 1000,
          uploadSpeed: torrent.uploadSpeed / 1000,
          timeRemaining: torrent.timeRemaining,
          progress: torrent.progress,
          filesHidden: torrents.length > 0 ? torrents[index].filesHidden : true,
        })
        return [...newTorrents]
      })
    }

    var interval = setInterval(onProgress, 1000)

    const onDone = () => {
      console.log('torrent downloaded')
      clearInterval(interval)
    }

    torrent.on('done', onDone)

    onProgress()
  }

  const addTorrent = (torrentLink) => {
    if (userContext?.userData?.client) {
      return userContext.userData.client.add(torrentLink, (torrent) =>
        torrentCallback(torrent),
      )
    }
  }

  return (
    <div className="content">
      {/* <div className="content__title">Торрент Клиент</div> */}
      {/* {previewTorrent ? ( */}
      <div className="content__preview-wrapper">
        <div id="preview-wrapper__player"></div>
        {previewTorrent ? (
          <div className="preview-wrapper__file-info">
            <div className="preview-wrapper__info-item preview-wrapper__info-item--name">
              <img className="content__img" src={fileIcon} alt="" />
              {
                previewTorrent.files.find(function (file) {
                  return (
                    file.name.endsWith('.mp4') ||
                    file.name.endsWith('.wav') ||
                    file.name.endsWith('.mp3')
                  )
                }).name
              }
            </div>
            <div className="preview-wrapper__info-item preview-wrapper__info-item--size">
              <img className="content__img" src={downloadIcon} alt="" />
              {`${Math.round(
                previewTorrent.files.find(function (file) {
                  return (
                    file.name.endsWith('.mp4') ||
                    file.name.endsWith('.wav') ||
                    file.name.endsWith('.mp3')
                  )
                }).length / 1000,
              )} KBytes`}
            </div>
          </div>
        ) : null}
      </div>
      {/* ) : null} */}
      <div className="content__controls">
        <label className="content__button" htmlFor="torrentFileUploader">
          <img className="content__img" src={fileIcon} alt="" />
          Открыть торрент-файл
        </label>
        <div
          className="content__button"
          onClick={() => setShowTorrentLink(!showTorrentLink)}
        >
          <img className="content__img" src={linkIcon} alt="" />
          Ссылка на торрент
        </div>
        {showTorrentLink ? (
          <div className="controls__input-field">
            <input
              type="text"
              placeholder="Введите ссылку на торрент..."
              onChange={(event) => setTorrentLink(event.target.value)}
            ></input>
            <div
              className="content__button"
              onClick={() => addTorrent(torrentLink)}
            >
              Скачать
            </div>
          </div>
        ) : null}
        <input
          id="torrentFileUploader"
          type="file"
          placeholder="Загрузите файл..."
          onChange={(event) => {
            addTorrent(event.target.files[0])
          }}
        ></input>
      </div>
      {torrents.length > 0 ? (
        <TorrentList
          torrents={torrents}
          hideTorrents={(id) => {
            let newTorrents = torrents
            newTorrents[id].filesHidden = !newTorrents[id].filesHidden
            return setTorrents([...newTorrents])
          }}
          deleteItem={(id) => {
            let newTorrents = torrents
            console.log(newTorrents)
            let deletedItem = newTorrents.splice(id, 1)
            userContext.userData.client.remove(deletedItem[0].magnetURI)
            setTorrents([...newTorrents])
          }}
          previewTorrent={(id) => {
            const torrent = torrents[id].files.find(function (file) {
              return (
                file.name.endsWith('.mp4') ||
                file.name.endsWith('.wav') ||
                file.name.endsWith('.mp3')
              )
            })

            if (torrent) {
              setPreviewTorrent({
                ...torrents[id],
              })

              let myNode = document.getElementById('preview-wrapper__player')
              while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild)
              }

              torrent.appendTo('#preview-wrapper__player')
            }
          }}
        />
      ) : (
        <div>
          Добавьте торрент-файл или magnet-ссылку для начала скачивания...
        </div>
      )}
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
                  <img
                    className="torrent-list__img"
                    src={
                      torrent.filesHidden ? folderClosedIcon : folderOpenIcon
                    }
                    alt=""
                  />
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
                    <div className="torrent-list__speed">
                      <img
                        className="torrent-list__img"
                        src={uploadIcon}
                        alt=""
                      />
                      {`${Math.round(
                        ((torrent.timeRemaining / 60) * 100) / 100,
                      )} min`}
                    </div>
                  </div>
                  <div className="torrent-list__progress-bar">
                    <div
                      className="torrent-list__progress-bar torrent-list__progress-bar--completed"
                      style={{
                        width: `${
                          Math.round(parseFloat(torrent.progress) * 100) / 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="torrent-list__speed">
                    {`${Math.round(parseFloat(torrent.progress) * 100) / 100}%`}
                  </div>
                </div>
                <div className="torrent-list__actions">
                  {/* <div className="torrent-list__action">Открыть</div> */}
                  <div
                    className="torrent-list__action"
                    onClick={() => props.deleteItem(index)}
                  >
                    Удалить
                  </div>
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
                        <div className="torrent-list__speed">{`${Math.round(
                          file.length / 1000,
                        )} KBytes`}</div>
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
