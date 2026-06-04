import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HistoryCard from '../components/HistoryCard';
import { useTheme } from '../context/ThemeContext';
import { getAllAnalyses, deleteAnalysis } from '../services/analysisService';
import { sampleHistory } from '../data/sampleHistory';
import { getCleanErrorMessage } from '../utils/errorHelper';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [activeRiskFilter, setActiveRiskFilter] = useState('all');
  const [minInput, setMinInput] = useState('0');
  const [maxInput, setMaxInput] = useState('100');
  const [rangeErrors, setRangeErrors] = useState({ min: '', max: '' });
  const [appliedRange, setAppliedRange] = useState({ min: 0, max: 100 });
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getRiskLevel = (score) => {
    const numericScore = Number(score) || 0;
    const normalizedScore =
      numericScore > 0 && numericScore <= 1
        ? numericScore * 100
        : Math.max(0, Math.min(numericScore, 100));

    if (normalizedScore >= 70) return 'low';
    if (normalizedScore >= 40) return 'medium';
    return 'high';
  };

  const getNormalizedScore = (score) => {
    const numericScore = Number(score) || 0;
    return numericScore > 0 && numericScore <= 1
      ? numericScore * 100
      : Math.max(0, Math.min(numericScore, 100));
  };

  const validateConfidenceRange = (minValue, maxValue) => {
    const nextErrors = { min: '', max: '' };

    if (minValue.trim() === '' || maxValue.trim() === '') {
      const message = 'Please enter both Min and Max values.';
      if (minValue.trim() === '') nextErrors.min = message;
      if (maxValue.trim() === '') nextErrors.max = message;
      return { isValid: false, errors: nextErrors };
    }

    const numericOnlyPattern = /^\d+$/;
    if (!numericOnlyPattern.test(minValue)) {
      nextErrors.min = 'Only numeric values are allowed.';
    }
    if (!numericOnlyPattern.test(maxValue)) {
      nextErrors.max = 'Only numeric values are allowed.';
    }
    if (nextErrors.min || nextErrors.max) {
      return { isValid: false, errors: nextErrors };
    }

    const minNumeric = Number(minValue);
    const maxNumeric = Number(maxValue);

    if (minNumeric < 0) nextErrors.min = 'Value cannot be less than 0.';
    if (maxNumeric < 0) nextErrors.max = 'Value cannot be less than 0.';
    if (minNumeric > 100) nextErrors.min = 'Value cannot exceed 100.';
    if (maxNumeric > 100) nextErrors.max = 'Value cannot exceed 100.';
    if (nextErrors.min || nextErrors.max) {
      return { isValid: false, errors: nextErrors };
    }

    if (minNumeric > maxNumeric) {
      nextErrors.min = 'Min value cannot be greater than Max.';
      nextErrors.max = 'Min value cannot be greater than Max.';
      return { isValid: false, errors: nextErrors };
    }

    if (minNumeric === maxNumeric) {
      nextErrors.min = 'Min and Max cannot be the same value.';
      nextErrors.max = 'Min and Max cannot be the same value.';
      return { isValid: false, errors: nextErrors };
    }

    return {
      isValid: true,
      errors: nextErrors,
      range: { min: minNumeric, max: maxNumeric },
    };
  };

  const updateRangeInput = (field, value) => {
    const nextMin = field === 'min' ? value : minInput;
    const nextMax = field === 'max' ? value : maxInput;

    if (field === 'min') setMinInput(value);
    if (field === 'max') setMaxInput(value);

    const validation = validateConfidenceRange(nextMin, nextMax);
    setRangeErrors(validation.errors);
    if (validation.isValid) {
      setAppliedRange(validation.range);
    }
  };

  const loadHistory = async () => {
    try {
      console.log('Loading history from API...');
      const response = await getAllAnalyses();
      const data = Array.isArray(response?.data) ? response.data : [];
      
      if (data.length === 0) {
        console.log('API returned empty history, using sample data.');
        setHistory(Array.isArray(sampleHistory) ? sampleHistory : []);
      } else {
        console.log(`Loaded ${data.length} records from API.`);
        setHistory(data);
      }
    } catch (error) {
      console.error('History API error:', error);
      setHistory(Array.isArray(sampleHistory) ? sampleHistory : []);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Analysis',
      'Are you sure you want to remove this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await deleteAnalysis(id);
              if (res.success) {
                setHistory(prev => prev.filter(item => item._id !== id));
              }
            } catch (err) {
              const message = getCleanErrorMessage(err);
              Alert.alert('Error', message);
            }
          }
        }
      ]
    );
  };

  const handleReanalyse = (text) => {
    navigation.navigate('Analyze', { prefillText: text });
  };

  const filteredHistory = history.filter((item) => {
    const text = item?.originalResponse || item?.originalText || '';
    const matchesSearch = text.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (activeRiskFilter !== 'all' && getRiskLevel(item?.score) !== activeRiskFilter) {
      return false;
    }

    const score = getNormalizedScore(item?.score);
    return score >= appliedRange.min && score <= appliedRange.max;
  });

  const riskFilters = [
    { key: 'all', label: 'All', color: theme.primary },
    { key: 'low', label: 'Low Risk', color: '#00C896' },
    { key: 'medium', label: 'Medium Risk', color: '#F5A623' },
    { key: 'high', label: 'High Risk', color: '#E05252' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Scoring History</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={onRefresh}>
            <Ionicons name="refresh" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search past analyses..."
            placeholderTextColor={theme.textDim}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>RECENT REPORTS</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {riskFilters.map((filter) => {
            const isActive = activeRiskFilter === filter.key;
            return (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterPill,
                  isActive
                    ? { backgroundColor: filter.color, borderColor: filter.color }
                    : { backgroundColor: 'transparent', borderColor: `${filter.color}80` },
                ]}
                onPress={() => setActiveRiskFilter(filter.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: isActive ? '#041824' : filter.color },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.rangeSection}>
          <Text style={styles.rangeTitle}>Confidence Range</Text>
          <View style={styles.rangeInputRow}>
            <View style={styles.rangeInputCol}>
              <Text style={styles.rangeInputLabel}>Min</Text>
              <TextInput
                style={styles.rangeInput}
                keyboardType="numeric"
                value={minInput}
                onChangeText={(value) => updateRangeInput('min', value)}
                placeholder="0"
                placeholderTextColor={theme.textDim}
              />
              {!!rangeErrors.min && <Text style={styles.rangeErrorText}>{rangeErrors.min}</Text>}
            </View>

            <View style={styles.rangeInputCol}>
              <Text style={styles.rangeInputLabel}>Max</Text>
              <TextInput
                style={styles.rangeInput}
                keyboardType="numeric"
                value={maxInput}
                onChangeText={(value) => updateRangeInput('max', value)}
                placeholder="100"
                placeholderTextColor={theme.textDim}
              />
              {!!rangeErrors.max && <Text style={styles.rangeErrorText}>{rangeErrors.max}</Text>}
            </View>
          </View>
        </View>

        {filteredHistory.length === 0 ? (
          <View style={styles.emptyStateWrap}>
            <Text style={styles.emptyStateText}>No reports match your current filters.</Text>
          </View>
        ) : (
          filteredHistory.map((item, index) => (
            <HistoryCard
              key={item?._id || `history-${index}`}
              item={item}
              onPress={() => navigation.navigate('ReportDetail', { report: item })}
              onDelete={() => handleDelete(item._id)}
              onReanalyse={(text) => handleReanalyse(text)}
            />
          ))
        )}

        {filteredHistory.length > 5 && (
          <TouchableOpacity style={styles.loadMoreButton} activeOpacity={0.8}>
            <Text style={styles.loadMoreText}>Load Older History</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: {
    color: theme.text,
    fontSize: 24,
    fontWeight: '700',
    width: 28,
    textAlign: 'center',
  },
  title: {
    color: theme.text,
    fontSize: 22,
    fontWeight: '800',
  },
  searchBar: {
    backgroundColor: theme.input,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchIcon: {
    color: theme.textMuted,
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    color: theme.text,
    fontSize: 17,
    marginLeft: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  filterBar: {
    paddingBottom: 14,
    gap: 10,
  },
  rangeSection: {
    marginBottom: 16,
  },
  rangeTitle: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  rangeInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rangeInputCol: {
    flex: 1,
  },
  rangeInputLabel: {
    color: theme.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  rangeInput: {
    backgroundColor: theme.input,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.text,
    fontSize: 15,
    fontWeight: '600',
  },
  rangeErrorText: {
    color: '#E05252',
    fontSize: 11,
    marginTop: 6,
    lineHeight: 14,
  },
  filterPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyStateWrap: {
    paddingVertical: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: theme.textMuted,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadMoreButton: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 6,
  },
  loadMoreText: {
    color: theme.text,
    fontSize: 17,
    fontWeight: '600',
  },
});
