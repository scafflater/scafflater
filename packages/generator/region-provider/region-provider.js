const ConfigProvider = require('config-provider')

const RegionTagType = {
  Unknown: 0,
  Start: 1,
  End: 2,
}

class RegionTag {
  constructor(name, start, end, type) {
    this.name = name
    this.regionTagType = type
    this.startPosition = start
    this.endPosition = end
  }

  static unknown() {
    return new RegionTag(RegionTagType.Unknown)
  }
}

class Region {
  get contentStart() {
    return this.startRegionTag.endPosition + 1
  }

  get contentEnd() {
    return this.endRegionTag === RegionTagType.unknown ? null : this.endRegionTag.startPosition - 1
  }

  get name() {
    if (this.startRegionTag && this.startRegionTag.name) {
      return this.startRegionTag.name
    }
    return ''
  }

  constructor(startRegionTag, endRegionTag = RegionTag.unknown()) {
    this.startRegionTag = startRegionTag
    this.endRegionTag = endRegionTag
  }
}

class RegionProvider {
  /**
  * Constructor
  * @param {ConfigProvider} ConfigProvider - The config provider
  */
  constructor(ConfigProvider) {
    this.configProvider = ConfigProvider
  }

  /**
  * Get regions from a string
  * @param {string} str - String to be analyzed
  * @return {Region[]} A list of regions
  */
  getRegions(str) {
    var completedRegions = []
    const regionRegex = new RegExp(`(?<start>${this.configProvider.singleLineComment}\\s*${this.configProvider.startRegionMarker})\\s*(?<startName>[\\S-]*).*$|(?<end>${this.configProvider.singleLineComment}\\s*${this.configProvider.endRegionMarker}.*$)`, 'gim')
    const regionMarkers = str.matchAll(regionRegex)
    var startedRegions = []

    for (const rm of regionMarkers) {
      if (rm.groups.start) {
        var startRegionTag = new RegionTag(rm.groups.startName, rm.index, rm.index + rm[0].length, RegionTagType.Start)
        var customRegion = new Region(startRegionTag)

        startedRegions.push(customRegion)
      } else if (rm.groups.end) {
        if (startedRegions.length === 0) {
          throw new Error(`Found an end region with no matching start tag at position ${rm.index}`)
        }
        var endTag = new RegionTag(null, rm.index, rm.index + rm[0].length, RegionTagType.end)

        var lastStartedRegion = startedRegions[startedRegions.length - 1]
        var finishedRegion = new Region(lastStartedRegion.startRegionTag, endTag)
        completedRegions.push(finishedRegion)
        startedRegions.pop()
      }
    }

    if (startedRegions.length > 0) {
      let errors = ''
      for (let err of startedRegions) {
        errors += `Found a started region with no matching end tag at position ${err.startPosition}`
      }
      throw new Error(errors)
    }

    return completedRegions
  }

  // var errors = []
  // for (let foldDefinition of foldDefinitions) {
  //   var startedRegions = []
  //   var start = new RegExp(foldDefinition.foldStartRegex, 'i') // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
  //   var end = new RegExp(foldDefinition.foldEndRegex, 'i')

  //   for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
  //     var line = lines[lineIndex]

  //     var startMatch = start.exec(line)
  //     var endMatch = end.exec(line)
  //     if (startMatch) {
  //       var startRegionTag = RegionTag.FromRegex(startMatch, RegionTagType.Start, lineIndex)
  //       var customRegion = new CustomRegion(startRegionTag)

  //       startedRegions.push(customRegion)
  //     } else if (endMatch) {
  //       if (startedRegions.length === 0) {
  //         errors.push(
  //           `Found an end region with no matching start tag at line ${lineIndex}`
  //         )
  //         continue
  //       }
  //       var endTag = RegionTag.FromRegex(endMatch, RegionTagType.End, lineIndex)
  //       var lastStartedRegion = startedRegions[startedRegions.length - 1]
  //       var finishedRegion = new CustomRegion(lastStartedRegion.startRegionTag, endTag)
  //       finishedRegion.isDefaultRegion = lastStartedRegion.isDefaultRegion
  //       completedRegions.push(finishedRegion)
  //       startedRegions.pop()
  //     }
  //   }

  //   if (startedRegions.length > 0) {
  //     for (let err of startedRegions) {
  //       errors.push(
  //         `Found a started region with no matching end tag at line ${
  //           err.lineStart
  //         }`
  //       )
  //     }
  //   }
  // }

  // return {
  //   completedRegions: completedRegions,
  //   errors: errors,
  // }
}

module.exports = {
  RegionProvider,
  RegionTag,
  CustomRegion: Region,
}
