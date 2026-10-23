import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { generateUniqueId } from '../context/AppContext';

const quickPrompts = [
  '💡 Bagaimana nak jimat RM100 bulan ini?',
  '👟 Boleh saya beli kasut baru RM250?',
  '📊 Analisis komitmen sewa & bil saya',
  '🥪 Tips jimat makan pelajar kampus',
  '🎓 Strategi urus elaun & PTPTN',
];

export default function AICoachChatModal({
  visible,
  onClose,
  totalIncome = 800,
  totalExpenses = 301,
  leftThisMonth = 499,
}) {
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'coach',
      text: `Hai Syed! 🎓 Saya Compass AI Coach anda.\n\nBerdasarkan data Oktober 2026, anda telah membelanjakan RM${totalExpenses} daripada elaun RM${totalIncome} anda (Kadar Simpanan: ${savingsRate}% • Baki: RM${leftThisMonth}).\n\nPrestasi kewangan anda sangat sihat! Ada apa-apa rancangan atau perbelanjaan yang ingin kita bincangkan bersama hari ini?`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [visible, messages]);

  const generateAIResponse = (userText) => {
    const lower = userText.toLowerCase();

    if (lower.includes('jimat') || lower.includes('100') || lower.includes('save')) {
      return `Bagus soalan tu! Untuk jimat RM100 bulan ini:\n\n1. ☕ Hadkan Kopi Kafe: Gantikan kopi harian (RM12/cawan) kepada bancuh sendiri di hostel 3 hari seminggu. Penjimatan: ~RM36.\n2. 📱 Semak Subscriptions: Gabungkan pelan keluarga untuk iCloud/Spotify bersama rakan sebilik. Penjimatan: ~RM15.\n3. 🍱 Masak Simple / Jimat Makan Malam: Masak mee/nasi di kolej waktu malam sekurang-kurangnya 2x seminggu. Penjimatan: ~RM50.\n\nJumlah potensi penjimatan: RM101/bulan! 🎯`;
    }

    if (lower.includes('kasut') || lower.includes('250') || lower.includes('beli') || lower.includes('shoe')) {
      return `Mari kita buat kiraan 'Impulse Check' 🧐:\n\n• Harga Kasut: RM250\n• Baki anda bulan ini: RM${leftThisMonth}\n• Bajet harian anda: ~RM25/hari\n\nKasut ini bersamaan 10 hari wang belanja anda! Walaupun baki mencukupi, membelinya akan mengurangkan simpanan anda sebanyak 50%.\n\nCadangan saya: Aktifkan '48-Hour Chill Lock' dalam aplikasi. Jika selepas 2 hari anda masih benar-benar memerlukannya, baru pertimbangkan pembelian. Setuju? 👍`;
    }

    if (lower.includes('sewa') || lower.includes('bil') || lower.includes('komitmen') || lower.includes('rent')) {
      return `Analisis Komitmen Anda 🏠:\n\n• Sewa Bilik: RM150 (18.7% daripada pendapatan)\n• Utiliti & WiFi: RM30 (3.7%)\n• Subscriptions: RM9 (1.1%)\n\nJumlah komitmen tetap ialah RM189 (~23.6%).\n\nNisbah ini SANGAT CEMERLANG untuk pelajar IPT kerana piawaian 50/30/20 mencadangkan komitmen keperluan di bawah 50%. Anda berada dalam zon selamat! ✨`;
    }

    if (lower.includes('makan') || lower.includes('kampus') || lower.includes('food')) {
      return `Tips Bajet Makan Pelajar IPT 🥪:\n\n1. Ambil lauk bersukat di kafe fakulti (1 nasi + 1 sayur + 1 ayam biasa = RM7-8).\n2. Bawa botol air mineral sendiri setiap hari (jimat RM3-5 sehari!).\n3. Beli buah & oat pek besar untuk sarapan pagi pantas di kolej.\n4. Elakkan GrabFood jika berjalan kaki ke kedai berdekatan hanya 5 minit.`;
    }

    if (lower.includes('ptptn') || lower.includes('elaun') || lower.includes('simpan')) {
      return `Formula Agihan Elaun Pelajar 🎓:\n\n• 50% Keperluan (Makan, Sewa, Pengangkutan): RM400\n• 30% Kehendak Santai (Keluar bersama kawan): RM240\n• 20% Simpanan Kecemasan / Pelaburan: RM160\n\nDengan mengekalkan kadar simpanan semasa anda sebanyak ${savingsRate}%, anda bakal memiliki dana kecemasan sekurang-kurangnya RM1,500 menjelang hujung semester! 🚀`;
    }

    return `Terima kasih atas soalan itu! Sebagai pelajar, kunci kestabilan kewangan adalah konsistensi mengesan perbelanjaan kecil setiap hari (seperti kopi RM12 atau snek). Baki semasa anda adalah RM${leftThisMonth}, yang berada dalam kedudukan sangat baik. Ada perkara khusus lain yang anda ingin rancang? 😊`;
  };

  const handleSendMessage = (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg = {
      id: generateUniqueId('usr'),
      sender: 'user',
      text,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateAIResponse(text);
      const coachMsg = {
        id: generateUniqueId('ai'),
        sender: 'coach',
        text: responseText,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, coachMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F4E8F8', '#E5D9F2']}
        locations={[0, 0.45, 1]}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.coachHeaderInfo}>
                <View style={styles.coachAvatar}>
                  <Text style={{ fontSize: 24 }}>🤖</Text>
                  <View style={styles.onlineBadge} />
                </View>
                <View>
                  <Text style={styles.coachName}>Compass AI Coach</Text>
                  <Text style={styles.coachStatus}>Online • Student Financial Mentor</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.circleBtn}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={22} color="#0D0E15" />
              </TouchableOpacity>
            </View>

            {/* Context Pill (Live Financial Standing) */}
            <View style={styles.statsPill}>
              <Ionicons name="analytics" size={16} color="#E91E63" style={{ marginRight: 6 }} />
              <Text style={styles.statsPillText}>
                Oct 2026: RM{totalExpenses} spent • {savingsRate}% savings rate • RM{leftThisMonth} left
              </Text>
            </View>

            {/* Messages Scroll Area */}
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.chatScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageRow,
                      isUser ? styles.messageRowUser : styles.messageRowCoach,
                    ]}
                  >
                    {!isUser && (
                      <View style={styles.bubbleAvatar}>
                        <Text style={{ fontSize: 14 }}>🤖</Text>
                      </View>
                    )}

                    <View
                      style={[
                        styles.messageBubble,
                        isUser ? styles.userBubble : styles.coachBubble,
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          isUser ? styles.userMessageText : styles.coachMessageText,
                        ]}
                      >
                        {msg.text}
                      </Text>
                      <Text
                        style={[
                          styles.messageTime,
                          isUser ? styles.userTime : styles.coachTime,
                        ]}
                      >
                        {msg.time}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {isTyping && (
                <View style={[styles.messageRow, styles.messageRowCoach]}>
                  <View style={styles.bubbleAvatar}>
                    <Text style={{ fontSize: 14 }}>🤖</Text>
                  </View>
                  <View style={[styles.messageBubble, styles.coachBubble, { paddingVertical: 12 }]}>
                    <ActivityIndicator size="small" color="#E91E63" />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Suggested Quick Prompts */}
            <View style={styles.quickPromptsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickPromptsScroll}
              >
                {quickPrompts.map((prompt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.promptChip}
                    onPress={() => handleSendMessage(prompt)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.promptChipText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Bottom Input Box */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Tanya AI Coach (cth: tips jimat kopi)..."
                placeholderTextColor="#94A3B8"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSendMessage()}
                returnKeyType="send"
              />

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
                ]}
                onPress={() => handleSendMessage()}
                activeOpacity={0.8}
                disabled={!inputText.trim()}
              >
                <Ionicons
                  name="arrow-up"
                  size={20}
                  color={inputText.trim() ? '#FFFFFF' : '#94A3B8'}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  coachHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coachAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.2)',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  coachName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D0E15',
  },
  coachStatus: {
    fontSize: 11,
    color: '#666666',
    marginTop: 1,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statsPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D0E15',
  },
  chatScroll: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 14,
    maxWidth: '85%',
  },
  messageRowCoach: {
    alignSelf: 'flex-start',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  coachBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#E91E63',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  coachMessageText: {
    color: '#0D0E15',
  },
  userMessageText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  coachTime: {
    color: '#94A3B8',
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  quickPromptsContainer: {
    paddingVertical: 6,
  },
  quickPromptsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  promptChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.25)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  promptChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E91E63',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' ? 16 : 12,
    marginTop: 6,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0D0E15',
    maxHeight: 100,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#E91E63',
  },
  sendButtonInactive: {
    backgroundColor: '#F1F5F9',
  },
});
