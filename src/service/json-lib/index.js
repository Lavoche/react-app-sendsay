export const formatJsonString = (str) => {

    const text =  str.replace(/\s+/g,'');

    let result = '';
    let deep = 0;

    const tab = (deep, char, isAfter) => {
        let resultChar = isAfter ? char+'\n' : '\n'+ char;
        for (let j =0; j < deep; j++) {
            resultChar = isAfter ? resultChar+'\t' : resultChar.slice(0, 1)+'\t'+resultChar.slice(1);
        }
        return resultChar
    }
    for (let i=0; i<text.length; i++) {

        switch (text[i]){
            case "[":
            case "{":
                deep++;
                result += tab(deep, text[i], true);
                break;
            case "]":
            case "}":
                deep--;
                result += tab(deep, text[i], false);
                break;
            case ",":
                result += tab(deep, text[i], true);
                break;
            case ":":
                result += ` ${text[i]} `;
                break;
            default :
                result += text[i];
        }
    }
    return result;
}

export const isJsonString = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}