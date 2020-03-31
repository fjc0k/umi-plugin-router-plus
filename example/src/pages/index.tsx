import React from 'react'
import { navigateBack, navigateForward, navigateTo, redirectTo } from 'umi'

export default function () {
  return (
    <div>
      <button
        onClick={() => {
          navigateTo('User', {
            id: 1,
          })
        }}>
        navigateTo user=1
      </button>
      <button
        onClick={() => {
          redirectTo('User', {
            id: 2,
          })
        }}>
        redirectTo user=2
      </button>
      <button
        onClick={() => {
          navigateBack()
        }}>
        navigateBack
      </button>
      <button
        onClick={() => {
          navigateForward()
        }}>
        navigateForward
      </button>
      <button
        onClick={() => {
          navigateTo('UserList')
        }}>
        navigateTo UserList
      </button>
      <button
        onClick={() => {
          navigateTo('UserRank')
        }}>
        navigateTo UserRank
      </button>
      <button
        onClick={() => {
          navigateTo('UserRank', {
            gender: 'female',
          })
        }}>
        navigateTo UserRank gender=female
      </button>
    </div>
  )
}
