import { NextResponse } from "next/server";
import { Resend } from "resend";

type HelpRequest = {
  name?: string;
  age?: string;
  location?: string;
  email?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HelpRequest;

    const name = body.name?.trim();
    const age = body.age?.trim();
    const location = body.location?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !age || !location || !email || !message) {
      return NextResponse.json(
        { error: "All required signal fields must be completed." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Please provide a little more detail so Vanta can help." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.HERO_NOTIFICATION_EMAIL;
    const from = process.env.RESEND_FROM || "Vanta Signal Desk <onboarding@resend.dev>";

    if (!apiKey || !recipient) {
      return NextResponse.json(
        {
          error:
            "Email delivery is not configured yet. Add RESEND_API_KEY and HERO_NOTIFICATION_EMAIL.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const submittedAt = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    const safe = {
      name: escapeHtml(name),
      age: escapeHtml(age),
      location: escapeHtml(location),
      email: escapeHtml(email),
      message: escapeHtml(message).replaceAll("\n", "<br />"),
      submittedAt: escapeHtml(submittedAt),
    };

    const { data, error } = await resend.emails.send({
      from,
      to: [recipient],
      replyTo: email,
      subject: `🛰 Signal Received — ${name} needs Vanta's help`,
      html: `
        <div style="background:#08090b;padding:40px 18px;font-family:Arial,sans-serif;color:#f6f3ed">
          <div style="max-width:620px;margin:0 auto;border:1px solid #292d33;background:#0e1013;padding:34px">
            <div style="font-size:11px;letter-spacing:4px;color:#8ef2cf;margin-bottom:24px">VANTA // RESONANCE NETWORK</div>
            <h1 style="font-size:36px;line-height:1.05;margin:0 0 12px">Someone needs your help.</h1>
            <p style="color:#a8adb5;line-height:1.7">A new signal has been received through the Vanta Help Portal.</p>
            <hr style="border:0;border-top:1px solid #292d33;margin:28px 0" />
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:9px 0;color:#777f89;width:130px">NAME</td><td style="padding:9px 0">${safe.name}</td></tr>
              <tr><td style="padding:9px 0;color:#777f89">AGE</td><td style="padding:9px 0">${safe.age}</td></tr>
              <tr><td style="padding:9px 0;color:#777f89">LOCATION</td><td style="padding:9px 0">${safe.location}</td></tr>
              <tr><td style="padding:9px 0;color:#777f89">EMAIL</td><td style="padding:9px 0">${safe.email}</td></tr>
              <tr><td style="padding:9px 0;color:#777f89">RECEIVED</td><td style="padding:9px 0">${safe.submittedAt}</td></tr>
            </table>
            <div style="margin-top:26px;border:1px solid #292d33;padding:20px;background:#090a0c">
              <div style="font-size:10px;letter-spacing:3px;color:#777f89;margin-bottom:12px">THE SIGNAL</div>
              <div style="font-size:16px;line-height:1.8">${safe.message}</div>
            </div>
            <p style="margin:28px 0 0;color:#777f89;font-size:12px;letter-spacing:1px">VANTA // THE SIGNAL BETWEEN PEOPLE</p>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch {
    return NextResponse.json(
      { error: "Unable to transmit the signal. Please try again." },
      { status: 500 }
    );
  }
}