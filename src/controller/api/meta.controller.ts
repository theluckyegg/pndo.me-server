/**
 * AuthController.ts
 * General authentication workflows
 * Notes:
 * - N/A
 * @author Elias Mawa <elias@emawa.io>
 * Created by Elias Mawa on 20-02-14
 */

import { ParameterizedContext } from "koa";
import Router from 'koa-router';
import { system_usage } from "../../util/sys-util";
import { MetadataModel, ProfileModel } from "../../model/mysql";
import { UploadRequest } from "types";
import { Connection } from "typeorm";

const router: Router = new Router();

router.all("/filestats", async (ctx: ParameterizedContext) => {
	const body: UploadRequest = ctx.request.body;
	const db: Connection = ctx.mysql;
	
	const file_repo = db.manager.getRepository(MetadataModel);
	
	const count = await file_repo.count();
	const bytes = await file_repo.createQueryBuilder()
		.select("SUM(bytes)", "sum").getRawOne();

	ctx.body = {
		count: count,
		bytes: bytes.sum
	}
});

router.all("/userstats", async (ctx: ParameterizedContext) => {
	const body: UploadRequest = ctx.request.body;
	const db: Connection = ctx.mysql;
	
	const profile_repo = db.manager.getRepository(ProfileModel);

	const count = await profile_repo.count();
	
	ctx.body = {
		count: count,
	}
});

router.all("/usage", async (ctx: ParameterizedContext) => {
	const usage_data = await system_usage();
	const payload = {
		memory_usage: usage_data.memory_usage,
		cpu_usage: usage_data.cpu_usage,
		disk_usage: usage_data.disk_usage,
	};

	ctx.body = payload;
});

router.all("/full_usage", async (ctx: ParameterizedContext) => {
	ctx.body = await system_usage();
});

const Controller: Router = router;

export default Controller;