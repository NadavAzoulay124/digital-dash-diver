
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendContractEmailRequest {
  recipientEmail: string;
  contractDetails: {
    client_company: string;
    total_value: number;
    services: Array<{
      service_name: string;
      price: number;
    }>;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, contractDetails }: SendContractEmailRequest = await req.json();

    console.log("Attempting to send contract email to:", recipientEmail);
    console.log("Contract details:", contractDetails);

    // Format services list for email
    const servicesList = contractDetails.services
      .map(service => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${service.service_name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">$${service.price.toLocaleString()}</td>
        </tr>
      `)
      .join("");

    // For testing - can only send to verified emails until domain is verified
    const fromEmail = "Contract Service <onboarding@resend.dev>";

    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      subject: `Contract Details for ${contractDetails.client_company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Contract Details</h1>
          <h2 style="color: #666;">Client: ${contractDetails.client_company}</h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Services Included:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #f8f8f8;">
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Service</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${servicesList}
              </tbody>
              <tfoot>
                <tr style="background-color: #f8f8f8; font-weight: bold;">
                  <td style="padding: 8px; border: 1px solid #ddd;">Total Value</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">$${contractDetails.total_value.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p style="color: #666; font-style: italic; margin-top: 20px; text-align: center;">
            This is a summary of your contract details. Please refer to the full contract for complete terms and conditions.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending contract email:", error);
    
    // Provide more specific error message for validation errors
    let errorMessage = error.message;
    if (error.statusCode === 403 && error.message.includes("verify a domain")) {
      errorMessage = "Email sending restricted: During testing, you can only send emails to your own verified email address. To send to other addresses, please verify your domain at resend.com/domains";
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message 
      }),
      {
        status: error.statusCode || 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
