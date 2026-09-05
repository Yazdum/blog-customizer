import { FormEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
} from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Text } from 'src/ui/text';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	articleState: ArticleStateType;
	onApply: (articleState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	articleState,
	onApply,
}: ArticleParamsFormProps) => {
	const [isArticleParamsSidebarOpen, setIsArticleParamsSidebarOpen] =
		useState(false);
	const [formState, setFormState] = useState<ArticleStateType>(articleState);
	const articleParamsSidebarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isArticleParamsSidebarOpen) {
			return;
		}

		const handleOutsideClick = (event: MouseEvent) => {
			if (
				event.target instanceof Node &&
				!articleParamsSidebarRef.current?.contains(event.target)
			) {
				setIsArticleParamsSidebarOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);

		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, [isArticleParamsSidebarOpen]);

	const handleOptionChange =
		<Field extends keyof ArticleStateType>(field: Field) =>
		(option: ArticleStateType[Field]) => {
			setFormState((currentState) => ({
				...currentState,
				[field]: option,
			}));
		};

	const toggleArticleParamsSidebar = () => {
		setIsArticleParamsSidebarOpen((isSidebarOpen) => !isSidebarOpen);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onApply(formState);
	};

	const handleReset = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	return (
		<div ref={articleParamsSidebarRef}>
			<ArrowButton
				isOpen={isArticleParamsSidebarOpen}
				onClick={toggleArticleParamsSidebar}
			/>
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isArticleParamsSidebarOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={handleOptionChange('fontFamilyOption')}
					/>
					<RadioGroup
						name='font-size'
						title='Размер шрифта'
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={handleOptionChange('fontSizeOption')}
					/>
					<Select
						title='Цвет шрифта'
						selected={formState.fontColor}
						options={fontColors}
						onChange={handleOptionChange('fontColor')}
					/>
					<Select
						title='Цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={handleOptionChange('backgroundColor')}
					/>
					<Select
						title='Ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={handleOptionChange('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
