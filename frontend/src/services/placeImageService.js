import api from './api'

export async function fetchPlaceImage(placeName) {
  const response = await api.get('/place-images', {
    params: {
      place: placeName,
    },
  })

  return response.data
}