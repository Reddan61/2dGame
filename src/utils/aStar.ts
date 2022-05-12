import { GameMap } from "@/GameMap"

export const AStar = (
    graph: {
        [XandY:string]:[string,number][]
    },
    canMoveMap: ([number,number]|null)[][],
    gameMap:GameMap,
    start:string,end:string,
    occupiedСells: string[]
    ) => {

    const costs = {} as any
    const processed = [start]
    let neighbors = [...graph[start]]
    const path = {} as any

    for(let i = 0; i < neighbors.length; i++) {
        costs[neighbors[i][0]] = newCostsNeighbor(neighbors[i][0],neighbors[i][1],canMoveMap)
        path[neighbors[i][0]] = start
    }

    let node = findLowestNode(costs,processed)
    let isFound = false
    
    while (node) {
        if(occupiedСells.includes(node)){
            processed.push(node)
            node = findLowestNode(costs,processed)
            continue
        }

        neighbors = [...graph[node]]
        
        for(let i = 0; i < neighbors.length; i++) {
            let newCost = costs[node] + newCostsNeighbor(neighbors[i][0],neighbors[i][1],canMoveMap)
        
            if(newCost < (costs[neighbors[i][0]] || Infinity)) {
                costs[neighbors[i][0]] = newCost
                path[neighbors[i][0]] = node
                if(neighbors[i][0] === String(start)) {
                    path[node] = neighbors[i][0]
                    costs[neighbors[i][0]] = Infinity
                }
            }
        }
        

        if(node === end) { 
            isFound = true
            break
        }

        processed.push(node)
        node = findLowestNode(costs,processed)
    }
   
    if(!isFound)
        return [isFound,[]]
    
    const convertedPath = [] as any
    let currentEl = end
    let positionWhile = 0
    while(positionWhile < Object.keys(path).length) {
        if(path[currentEl]) {
            convertedPath.unshift(currentEl)
        }
        currentEl = path[currentEl]
        positionWhile++

        if(currentEl === start) {
            break
        }
    }

    return [isFound,convertedPath]

    function newCostsNeighbor(neighbor:string,costTile:number,canMoveMap:([number,number]|null)[][]):number {
        const splitedNeighbor = neighbor.split(",")
        const splitedEnd = end.split(",")
        
        const neighborPosition = canMoveMap[Number(splitedNeighbor[1])][Number(splitedNeighbor[0])]
        const endPosition = canMoveMap[Number(splitedEnd[1])][Number(splitedEnd[0])]

        const totalTilesToEndFromNeighbor = Math.abs((endPosition![0] - neighborPosition![0])/gameMap.TILESIZE) + Math.abs((endPosition![1] - neighborPosition![1])/gameMap.TILESIZE)
        
    
        return costTile  + totalTilesToEndFromNeighbor*10
    }
   
    function findLowestNode(costs:any,processed:string[]):string {
        let lowestCost = Infinity
        let lowestNode = ""
        Object.keys(costs).forEach(el => {
            if(costs[el] < lowestCost && !processed.includes(el)) {
                lowestCost = costs[el]
                lowestNode = el
            }
        })
        return lowestNode
    }
}