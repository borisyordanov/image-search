function searchResultModel(data) {
    return {
        url: data.webSearchUrl,
        snippet: data.name,
        thumbnail: data.thumbnailUrl,
        context: data.hostPageDisplayUrl
    };
}


module.exports = searchResultModel;