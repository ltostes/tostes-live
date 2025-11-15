import * as d3 from 'd3';
import * as Plot from '@observablehq/plot';
import { removeDuplicates } from '../utils.js'

export function overviewGraph(
    overviewData,
    {
      ordering_1,
      ordering_2,
      width,
      height,
      marginLeft,
      insetLeft,
      refDate,
      timerange,
      teamname,
      minimunTeamMembers = 3
    }
  ) {

    const image_size = 30;
    const dx_image = image_size * 0.6;
    const marginTop = 50;

    const teamData = {name: teamname, 
                      games: removeDuplicates(
                              overviewData.reduce((current, next) => [...current, ...next.games], 
                                                  [])
                              )
                              .filter(f => f.numTeamMembers >= minimunTeamMembers)
                      }

    const fy_domain = [
      teamname,
      ...d3
        .sort(
          overviewData,
          (a, b) =>
            d3.descending(a[ordering_1], b[ordering_1]) ||
            d3.descending(a[ordering_2], b[ordering_2])
        )
        .map((d) => d.name)
    ];
  
    const x_domain = [refDate, d3.utcDay.offset(refDate, -timerange)];

    const dotConfig = Plot.dodgeY({
      fy: "name",
      x: "sessionDate",
      anchor: 'middle',
    });

    function flattenGamesData(profilesData) {
      return profilesData
        .map(
          (profile) =>
            profile.games.map((g) => ({ ...g, name: profile.name }))
        )
        .flat();
    }
  
    const plot = Plot.plot({
      width,
      height,
      marginLeft,
      marginTop,
      insetLeft,
      x: {
        type: "utc",
        axis: "top",
        grid: true,
        domain: x_domain,
        labelOffset: 40,
        label: "Date"
      },
      fy: {
        label: null,
        domain: fy_domain
      },
      marks: [
        Plot.image(
          overviewData,
          Plot.selectFirst({
            fy: "name",
            frameAnchor: "left",
            src: "avatar",
            dx: dx_image,
            height: image_size
          })
        ),
        // Team games
        Plot.dot(
          flattenGamesData([teamData])
          , 
            {
              ...dotConfig,
              fill: 'purple',
              r: 3.5
            }
        ),
        // Player games in team 
        Plot.dot(
          flattenGamesData(overviewData)
            .filter(g => g.numTeamMembers >= minimunTeamMembers)
          , 
            {
              ...dotConfig,
              fill: true,
            }
        ),
        // Player games without team
        Plot.dot(
          flattenGamesData(overviewData)
            .filter(g => g.numTeamMembers < minimunTeamMembers)
          , {
            ...dotConfig,
            strokeOpacity: 0.2,
          }
        ),
        // Day ticks
        Plot.tickX(d3.unixDay.range(x_domain[1], x_domain[0], 1), {
          strokeOpacity: 0.05,
        }),
        // Today marker
        Plot.dot([0], {
          frameAnchor: "top-left",
          fy: (d) => fy_domain[0],
          height: 2,
          x: (d) => x_domain[0],
          symbol: "star",
          r: 2,
          dy: -3
        }),
        // Today marker (text)
        Plot.text([0], {
          frameAnchor: "top-left",
          fy: (d) => fy_domain[0],
          height: 2,
          x: (d) => x_domain[0],
          text: (d) => ("Today"),
          lineAnchor: "bottom",
          textAnchor: "middle",
          fontStyle: "italic",
          dy: -13
        }),
      ]
    });
  
    return [plot, teamData];
  }