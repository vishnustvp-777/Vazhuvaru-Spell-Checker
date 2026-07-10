import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Scanner;

public class GeminiTamilChecker {
    // Add your API Key here before running locally. Do not commit the key to public GitHub.
    private static final String API_KEY = "AQ.Ab8RN6L5jOJhN_PledBIApN2RqLqpHhfHx0-TSiS18cL2-gWEQ"; 
    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent" + API_KEY;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in, "UTF-8");
        System.out.println("=== வழுவறு: Tamil Spell & Grammar Checker (v2 AI-Powered) ===");
        System.out.print("Enter Tamil sentence: ");

        if (!scanner.hasNextLine()) return;
        String input = scanner.nextLine();

        try {
            String prompt = "Analyze this Tamil sentence for spelling and grammar errors. " +
                            "If there are mistakes, point out exactly where and how to correct them in English: " + input;

            // Pure string JSON construction payload
            String jsonBody = "{\"contents\":[{\"parts\":[{\"text\":\"" + prompt + "\"}]}]}";

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            System.out.println("\nAnalyzing with Gemini AI...\n");
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            String responseBody = response.body();
            int textStart = responseBody.indexOf("\"text\": \"");
            
            if (textStart != -1) {
                textStart += 9;
                int textEnd = responseBody.indexOf("\"", textStart);
                String extractedText = responseBody.substring(textStart, textEnd).replace("\\n", "\n");
                System.out.println(extractedText);
            } else {
                System.out.println("Error parsing response: \n" + responseBody);
            }
        } catch (Exception e) {
            System.out.println("System Error: " + e.getMessage());
        }
        scanner.close();
    }
}