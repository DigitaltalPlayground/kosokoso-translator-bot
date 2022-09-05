/** @typedef {Symbol("CID")} CID */
/** @param {string} text @returns {number[]} */
function TextToByteArray(text){
  if(typeof text !== "string") throw new Error("Received param is not a string!");
  const result = [];
  if (text == null)
    return result;
  for (var i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c <= 0x7f) {
      result.push(c);
    } else if (c <= 0x07ff) {
      result.push(((c >> 6) & 0x1F) | 0xC0);
      result.push((c & 0x3F) | 0x80);
    } else {
      result.push(((c >> 12) & 0x0F) | 0xE0);
      result.push(((c >> 6) & 0x3F) | 0x80);
      result.push((c & 0x3F) | 0x80);
    }
  }
  return result;
}
/** @param {number[]} arr @returns {string} */
function ByteArrayToText(arr) {
  if(!Array.isArray(arr)) throw new Error("Received param is not an array!");
  if (arr == null)
    return null;
  let result = "";
  let i;
  while (i = arr.shift()) {
    if (i <= 0x7f) {
      result += String.fromCharCode(i);
    } else if (i <= 0xdf) {
      let c = ((i&0x1f)<<6);
      c += arr.shift()&0x3f;
      result += String.fromCharCode(c);
    } else if (i <= 0xe0) {
      let c = ((arr.shift()&0x1f)<<6)|0x0800;
      c += arr.shift()&0x3f;
      result += String.fromCharCode(c);
    } else {
      let c = ((i&0x0f)<<12);
      c += (arr.shift()&0x3f)<<6;
      c += arr.shift() & 0x3f;
      result += String.fromCharCode(c);
    }
  }
  return result;
}

// !!!
// 共通中間データ = Common Intermediate Data = CID
// データ様式は、配列。
// 翻訳元の文字列を通常文字と翻訳で置換されない特殊に分割した配列にし、通常文字を0と1の数値に変換したもの
// !!!

/** テキストからCIDに変換
 * @param {string} value @returns {CID} */
function convertTextToCID(value){
  if(typeof value !== "string") throw new Error("Received param is not a string!");
  return value.split("").map(function(char){
    switch(char){
      case "？": return "？";
      case "！": return "！";
      case "?": return "?";
      case "!": return "!";
      case "、": return "、";
      case "。": return "。";
      case ",": return ",";
      case ".": return ".";
      case "\r": return "\r";
      case "\n": return "\n";
      default: return TextToByteArray(char).map(function(byte){
        return (256 + byte).toString(2).substr(1)
      }).join("");
    }
  });
}
/**こそこそ語(可逆)をCIDに変換
 * @param {string} koso1 @return {CID} */
function convertKoso1ToCID(value){
  if(typeof value !== "string") throw new Error("Received param is not a string!");
  const raw = value.split('')
  let result = [];
  let current = [];
  for(let i = 0; i < raw.length; i++){
    switch(raw[i]){
      case "こ":
        current.push("0");
        break;
      case "そ":
        current.push("1");
        break;
      case "？":
      case "！":
      case "?":
      case "!":
      case "、": 
      case "。": 
      case ",": 
      case ".":
      case "\r":
      case "\n":
        if(current.length > 0){
          result.push(current.join(""));
          current = [];
        }
        result.push(raw[i]);
        break;
      default: throw new Error("Invalid character");
    }
  }
  if(current.length > 0)
    result.push(current.join(""));
  return result;
}
/**CIDからテキストに変換
 * @param {CID} value @return {string} */
function convertCIDToText(value){
  if(!Array.isArray(value)) throw new Error("Received param is not an array!");
  const result = [];
  for(let i = 0; i < value.length; i++){
    switch(value[i]){
      case "？":
      case "！":
      case "?":
      case "!":
      case "、": 
      case "。": 
      case ",": 
      case ".":
      case "\r":
      case "\n":
        result.push(value[i]);
        break;
      default:
        while(value[i].length % 8 !== 0){
          value[i] = "0" + value[i];
        }
        const chunkLen = value[i].length / 8;
        const bytes = [];
        for(let j = 0; j < chunkLen; j++){
          bytes.push(parseInt([...Array(8)].map(function(_, k){
            return value[i][j * 8 + k]
          }).join(""), 2));
        }
        result.push(ByteArrayToText(bytes));
        break;
    }
  }
  return result.join("");
}
/**CIDからこそこそ語(可逆)に変換
 * @param {CID} value @return {string} */
function convertCIDToKoso1(value){
  if(!Array.isArray(value)) throw new Error("Received param is not an array!");
  const result = [];
  for(let i = 0; i < value.length; i++){
    switch(value[i]){
      case "？":
      case "！":
      case "?":
      case "!":
      case "、": 
      case "。": 
      case ",": 
      case ".":
      case "\r":
      case "\n":
        result.push(value[i]);
        break;
      default:
        result.push(value[i].split("").map(function(char){
          switch(char){
            case "0": return "こ";
            case "1": return "そ";
          }
        }).join(""));
    }
  }
  return result.join("");
}
/** CIDからこそこそ語(非可逆)に変換
 * @param {CID} value @return {string} koso2 */
function convertCIDToKoso2(value){
  if(!Array.isArray(value)) throw new Error("Received param is not an array!");
  const result = [];
  for(let i = 0; i < value.length; i++){
    switch(value[i]){
      case "？":
      case "！":
      case "?":
      case "!":
      case "、": 
      case "。": 
      case ",": 
      case ".":
      case "\r":
      case "\n":
        result.push(value[i]);
        break;
      default:
        console.log(value[i]);
        result.push(value[i].split("").reduce(function(prev, current){
          return Number(prev) + Number(current);
        }) % 2 === 0 ? "こ" : "そ");
    }
  }
  return result.join("");
}

module.exports = {
  convertCIDToKoso1,
  convertCIDToKoso2,
  convertCIDToText,
  convertKoso1ToCID,
  convertTextToCID,
}