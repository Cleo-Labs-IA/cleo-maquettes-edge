// Fonctions pures partagées par le vérificateur et ses tests ciblés.
export function htmlPourStructure(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
}

export function imageCasseeChargee(image) {
  return image.complete && image.naturalWidth === 0
}
