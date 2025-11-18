import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class DebuggingThrottlerGuard extends ThrottlerGuard {
    protected getTracker(req: Record<string, any>): Promise<string> {
        console.log(req.ip);
        console.log(req.ips);

        return req.ips.length ? req.ips[0] : req.ip;
    }
}