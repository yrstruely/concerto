
function accountingDocumentReferences(type) {
    let extension = null
    if (type.toUpperCase() === 'ACCRUAL') {
        extension = '-PA'
    }
    else if (type.toUpperCase() === 'CASH') {
        extension = '-PE'
    } 
    else if (type.toUpperCase() === 'CARD') {
        extension = '-PC'
    }
    else {
        throw "Error: accounting document reference type must be one of: Accrual, Cash, or, Card!"
    }
    const randomInt = getRandomInt(9999999)
    const documentReference = 'ER0' + randomInt + extension
    const documentReferenceWBS = 'ER0' + (randomInt + 1) + extension
    
    return {
        documentReference: documentReference,
        documentReferenceWBS: documentReferenceWBS
    }
}
module.exports = {
    accountingDocumentReferences
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}