function serializeSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink")
  clone.removeAttribute("class")
  const serializer = new XMLSerializer()
  return `<?xml version="1.0" standalone="no"?>\r\n${serializer.serializeToString(clone)}`
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function exportSvg(svg: SVGSVGElement, filename = "diagram.svg") {
  const source = serializeSvg(svg)
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" })
  triggerDownload(blob, filename)
}

export function exportRaster(
  svg: SVGSVGElement,
  format: "png" | "jpeg",
  filename: string,
  width: number,
  height: number,
  scale = 2
): Promise<void> {
  return new Promise((resolve, reject) => {
    const source = serializeSvg(svg)
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = width * scale
      canvas.height = height * scale
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error("Canvas not supported"))
        return
      }

      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Export failed"))
            return
          }
          triggerDownload(blob, filename)
          resolve()
        },
        format === "png" ? "image/png" : "image/jpeg",
        0.95
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to rasterize diagram"))
    }

    img.src = url
  })
}
