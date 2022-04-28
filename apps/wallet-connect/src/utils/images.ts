const blobToImageData = async (blob: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    let img = new Image()
    img.src = blob
    img.onload = () => resolve(img)
    img.onerror = err => reject(err)
  }).then(img => {
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    let ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('Could not generate context from canvas')

    ctx.drawImage(img, 0, 0)
    return ctx.getImageData(0, 0, img.width, img.height) // some browsers synchronously decode image here
  })
}

export { blobToImageData }
