import {Request, Response} from "express";
import client from "../utils/cassandraClient";
import {mapVideos} from "../utils/databaseHelper";
import {QueryOptions, types} from "cassandra-driver";
import {ApiResponse, VideoResponse} from "../types/responseInterfaces";

export const getVideoList = async (req: Request, res: Response<ApiResponse<VideoResponse[]>>): Promise<void> => {
    try {
        const {limit = 1, page_state} = req.query

        const options: QueryOptions = {
            prepare: true,
            autoPage: true,
            fetchSize: Number(limit),
        };

        if (page_state && page_state !== 'null') {
            options.pageState = page_state as string | undefined;
        }

        let result: types.ResultSet = await client.execute("SELECT * FROM videos;", [], options);

        const data: VideoResponse[] = await mapVideos(result.rows);

        res.json({
            data,
            page_state: result.pageState
        });
    } catch (error) {
        res.status(500).json({message: "Error fetching videos"});
    }
};
