import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class Main {
    private static final Set<String> dictionary = new HashSet<>();

    static {
        dictionary.add("அம்மா");
        dictionary.add("வணக்கம்");
        dictionary.add("தமிழ்");
        dictionary.add("பள்ளி");
        dictionary.add("மாணவன்");
        dictionary.add("புத்தகம்");
        dictionary.add("நன்றி");
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in, "UTF-8");
        System.out.println("=== வழுவறு: Tamil Spell Checker (v1 Rule-Based) ===");
        System.out.println("Note: Terminal must support UTF-8 complex text shaping.");
        System.out.print("Enter text to check: ");
        
        if (!scanner.hasNextLine()) return;
        String input = scanner.nextLine();
        
        String[] words = input.split("\\s+");
        
        System.out.println("\n--- Analysis Results ---");
        for (String word : words) {
            String cleanedWord = word.replaceAll("[.,!?]", "");
            if (cleanedWord.isEmpty()) continue;
            
            if (dictionary.contains(cleanedWord)) {
                System.out.println(cleanedWord + " : Correct");
            } else {
                System.out.println(cleanedWord + " : Incorrect/Unknown");
                findSuggestions(cleanedWord);
            }
        }
        scanner.close();
    }

    private static void findSuggestions(String target) {
        System.out.print("  Suggestions: ");
        boolean found = false;
        for (String dictWord : dictionary) {
            if (getEditDistance(target, dictWord) <= 2) {
                System.out.print(dictWord + " ");
                found = true;
            }
        }
        if (!found) System.out.print("No close matches found.");
        System.out.println();
    }

    private static int getEditDistance(String s1, String s2) {
        int[] costs = new int[s2.length() + 1];
        for (int i = 0; i <= s1.length(); i++) {
            int lastValue = i;
            for (int j = 0; j <= s2.length(); j++) {
                if (i == 0) costs[j] = j;
                else if (j > 0) {
                    int newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
            if (i > 0) costs[s2.length()] = lastValue;
        }
        return costs[s2.length()];
    }
}