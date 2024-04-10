import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  sendEmailViaMailchimp,
  subscribe,
  getQuantity,
} from '../services/SubscribeService'
import {
  Facebook,
  LinkedIn,
  Mute,
  Unmute,
  Logo,
  Check,
  Close,
} from '../icon/icon'
import { useDebounceFn } from '../hooks/debounce'

const Main = () => {
  const [email, setEmail] = useState('')
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [emailStatus, setEmailStatus] = useState(null)
  const [showMessage, setShowMessage] = useState(false)
  const [quantity, setQuantity] = useState()
  const [submitted, setSubmitted] = useState()
  const videoRef = useRef(null)

  const getEmailQuantity = useCallback(async () => {
    try {
      const res = await getQuantity()
      setQuantity(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getEmailQuantity()
  }, [getEmailQuantity])

  useEffect(() => {
    if (subscriptionStatus !== null || emailStatus !== null) {
      getEmailQuantity()

      setShowMessage(true)
      const timeout = setTimeout(() => {
        setShowMessage(false)
        setSubscriptionStatus(null)
        setEmailStatus(null)
      }, 5000) // Change the timeout duration (in milliseconds) as needed
      return () => clearTimeout(timeout)
    }
  }, [subscriptionStatus, emailStatus, getEmailQuantity])

  const subscribeWebsite = async () => {
    try {
      const res = await subscribe({ email: email })
      setSubscriptionStatus(res.status)
      setEmail('')
      setSubmitted(false)
    } catch (err) {
      console.log('Error subscribing:', err)
      setSubscriptionStatus(err.response ? err.response.status : 500)
    }
  }

  const addEndSendEmails = async () => {
    try {
      const res = await sendEmailViaMailchimp({ email: email })
      setEmailStatus(res.status)
    } catch (err) {
      console.log('Error sending email:', err)
      setEmailStatus(err.response ? err.response.status : 500)
    }
  }

  const toggleVideoMuted = () => {
    const video = videoRef.current
    if (video) {
      video.muted = !video.muted
      setIsVideoMuted(video.muted)
    }
  }

  const getMessageForStatus = (statusCode) => {
    switch (statusCode) {
      case 200:
      case 201:
        return 'წარმატება თქვენ წარმატებით გახდით TvinUP-ელი !'
      case 409:
        return 'თქვენი ელ.ფოსტა უკვე ჩანიშნული გვაქვს'
      case 500:
        return 'შეცდომა დაფიქსირდა ტექნიკური ხარვეზი'
      default:
        return ''
    }
  }

  const isEmailValid = (email) => {
    const emailRegex = /^[a-z0-9.+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
    return emailRegex.test(email)
  }

  const onSubmit = () => {
    setSubmitted(true)
    subscribeWebsite()
    addEndSendEmails()
  }

  const handleOnSubmit = useDebounceFn(onSubmit, 300)
  return (
    <div className='main w-[100%] h-[100vh]'>
      <video
        src='background_video.mp4'
        autoPlay
        loop
        muted={isVideoMuted}
        ref={videoRef}
        className='w-full h-full object-cover'
      />
      <div className='absolute w-full h-full flex flex-col top-0 justify-center items-center'>
        {showMessage && (
          <div className='absolute top-0 right-2 message-box mt-4 flex mb-1 rounded-lg justify-center items-center p-3'>
            {subscriptionStatus === 200 || emailStatus === 200 ? (
              <div
                className='flex justify-between items-center bg-green-100 border-l-4 border-green-500 text-green-700 p-2 py-3 rounded-lg'
                style={{ animation: 'slide-in-right 0.5s forwards' }}
              >
                <Check />
                <div className='flex flex-col justify-center items-start'>
                  <p className='text-lg font-semibold'>წარმატება</p>
                  <p>თქვენ წარმატებით გახდით TvinUP-ელი !</p>
                </div>
              </div>
            ) : (
              <div
                className='flex justify-between items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-2 py-3 rounded-lg'
                style={{ animation: 'slide-in-right 0.5s forwards' }}
              >
                <Close />
                <div className='flex flex-col justify-center items-start'>
                  <p className='text-lg font-semibold'>შეცდომა</p>
                  <p>
                    {getMessageForStatus(subscriptionStatus || emailStatus)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        <div className='bg-[#0000004b] px-2 py-4 flex flex-col justify-center items-center rounded-xl drop-shadow-2xl gap-3'>
          <div className='flex flex-col items-center justify-center gap-1'>
            <span className='text-2xl text-white font-bold'>უკვე</span>
            <span className='text-4xl text-[#f74242] font-extrabold'>
              {quantity}
            </span>
            <span className='text-2xl text-white font-bold flex items-center'>
              <span>
                <Logo />
              </span>
              <span>-ელი</span>
            </span>
          </div>
          <div className='flex lg:w-[90%] justify-center text-center items-center p-2 md:text-xl text-white font-bold'>
            <span>
              დაგვიტოვე ელ.ფოსტა და როგორც კი გავეშვებით პირველი შენ გაცნობებთ
              🚀
            </span>
          </div>

          <form
            className='lg:w-[50%] mx-auto flex flex-col'
            onSubmit={(e) => e.preventDefault()}
          >
            <div className='mb-5 w-full'>
              <input
                type='text'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 px-3 outline-none'
                placeholder='შეიყვანეთ ელ.ფოსტა'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <span
                className={`mt-1 text-sm ${
                  email && !/^[a-z0-9.+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)
                    ? 'text-[rgb(254,80,0)]'
                    : 'hidden'
                }`}
              >
                გთხოვთ შეიყვანოთ სწორი ელ.ფოსტა.
              </span>

              <span
                className={`mt-1 text-sm ${
                  submitted && !email ? 'text-[rgb(254,80,0)]' : 'hidden'
                }`}
              >
                ველის შევსება სავალდებულოა.
              </span>
            </div>
            <button
              onClick={() => {
                handleOnSubmit()
              }}
              className={`font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center bg-[#FCD567] w-full hover:bg-[#e0b84e] transition-colors duration-300 text-black ${
                !isEmailValid(email) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!isEmailValid(email)}
            >
              დადასტურება
            </button>
          </form>
          <div className='flex lg:w-[50%] w-full justify-around items-center'>
            <div className='flex justify-between items-center gap-1 hover:cursor-pointer '>
              <Facebook />
              <span className='text-white'>Facebook</span>
            </div>
            <div className='flex justify-between items-center gap-1 hover:cursor-pointer'>
              <LinkedIn />
              <span className='text-white'>LinkedIn</span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={toggleVideoMuted}
        className='absolute flex justify-center items-center gap-2 top-4 left-4 bg-[#0000004b] text-white p-2 rounded-full z-10'
      >
        {isVideoMuted ? <Unmute /> : <Mute />}
        {isVideoMuted ? 'ხმის ჩართვა' : 'ხმის გამორთვა'}
      </button>
    </div>
  )
}

export default Main
