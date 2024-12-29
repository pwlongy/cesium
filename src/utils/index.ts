interface timeObj{
    "M+": number,
    "d+": number,
    "h+": number,
    "m+": number,
    "s+": number,
    "q+": number,
    "S": number
}

export  const formatDate = (dataTime:Date, format:string):string=> {
    let data:Date = dataTime || new Date();
    /*
     * eg:format="YYYY-MM-dd hh:mm:ss";
     */
    let o:any = {
        "M+": data.getMonth() + 1,
        "d+": data.getDate(),
        "h+": data.getHours(),
        "m+": data.getMinutes(),
        "s+": data.getSeconds(),
        "q+": Math.floor((data.getMonth() + 3) / 3),
        "S": data.getMilliseconds()
    }

    if (/(Y+)/.test(format)) {
        format = format.replace(RegExp.$1, (data.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}